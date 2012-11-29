# This file is used during development only.
# It has just some handy shortcuts.
RUNTIME_DIR=../photodb-runtime
OPENEJB_DIRECTORY=$(RUNTIME_DIR)/openejb
TOMEE_DIRECTORY=$(RUNTIME_DIR)/tomee
TOMEEPLUS_ZIP=$(TOMEE_DIRECTORY)/apache-tomee-1.5.0-plus.tar.gz

clean-log:
	rm -f $(RUNTIME_DIR)/runtime.log

clean: kill-tomee
	rm -rf $(RUNTIME_DIR)
	mvn clean

openejb: $(OPENEJB_DIRECTORY)

$(TOMEEPLUS_ZIP):
	mkdir -p $(TOMEE_DIRECTORY)
	cd $(TOMEE_DIRECTORY) && wget https://dl.dropbox.com/u/1459144/posts/apache-tomee-1.5.0-plus.tar.gz

gettomee: $(TOMEEPLUS_ZIP)

$(OPENEJB_DIRECTORY):
	mkdir -p $(OPENEJB_DIRECTORY)
	cd $(OPENEJB_DIRECTORY) && svn co https://svn.apache.org/repos/asf/openejb/trunk/openejb source-code
	cd $(OPENEJB_DIRECTORY)/source-code && mvn clean install -DskipTests=true 

kill-tomee:
	@if test -f $(RUNTIME_DIR)/tomee-pid.txt; then \
		kill -9 `cat $(RUNTIME_DIR)/tomee-pid.txt`; \
		rm $(RUNTIME_DIR)/tomee-pid.txt; \
	fi

start-tomee: kill-tomee deploy
	export JPDA_SUSPEND=n && export CATALINA_PID=$(RUNTIME_DIR)/tomee-pid.txt \
		&& $(TOMEE_DIRECTORY)/apache-tomee-plus-1.5.0/bin/catalina.sh jpda start

build: clean-log openejb
	mvn clean install -DskipTests=true 

prepare-webapps:
	cd $(TOMEE_DIRECTORY) && rm -rf apache-tomee-plus-1.5.0 && tar -xvzf apache-tomee-1.5.0-plus.tar.gz
	cp ./photodb-web/target/photodb-web.war $(TOMEE_DIRECTORY)/apache-tomee-plus-1.5.0/webapps/
	cp -f ./tomcat-users.xml $(TOMEE_DIRECTORY)/apache-tomee-plus-1.5.0/conf/
	cp -f ./tomee.xml $(TOMEE_DIRECTORY)/apache-tomee-plus-1.5.0/conf/

deploy: build gettomee prepare-webapps

run-jasmine:
	cd ./photodb-web/ && mvn jasmine:bdd

up-static:
	rm -rf $(TOMEE_DIRECTORY)/apache-tomee-plus-1.5.0/webapps/photodb-web/app
	cp -r photodb-web/src/main/webapp/app $(TOMEE_DIRECTORY)/apache-tomee-plus-1.5.0/webapps/photodb-web/

.PHONY: clean clean-log openejb gettomee kill-tomee start-tomee build prepare-webapps deploy run-jasmine
