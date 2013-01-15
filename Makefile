#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#

CURRENT_DIR=$(shell cd .. && pwd)
RUNTIME_DIR=$(CURRENT_DIR)/photodb-runtime
OPENEJB_DIRECTORY=$(RUNTIME_DIR)/openejb
OPENEJB_SVN=https://svn.apache.org/repos/asf/tomee/trunk/openejb
TOMEE_DIRECTORY=$(RUNTIME_DIR)/tomee
TOMEEPLUS_ZIP_NAME=apache-tomee-plus-1.5.2-SNAPSHOT
TOMEEPLUS_ZIP=$(RUNTIME_DIR)/openejb/source-code/tomee/apache-tomee/target/$(TOMEEPLUS_ZIP_NAME).tar.gz

clean-log:
	rm -f $(RUNTIME_DIR)/runtime.log

clean: kill-tomee $(OPENEJB_DIRECTORY)
	cd $(OPENEJB_DIRECTORY)/source-code && mvn clean
	rm -rf $(TOMEE_DIRECTORY)
	mvn clean

openejb: $(OPENEJB_DIRECTORY) $(OPENEJB_DIRECTORY)/source-code/tomee/apache-tomee/target

$(TOMEEPLUS_ZIP_NAME):

$(TOMEE_DIRECTORY):
	mkdir -p $(TOMEE_DIRECTORY)

$(TOMEEPLUS_ZIP): openejb $(TOMEE_DIRECTORY)
	cp $(TOMEEPLUS_ZIP) $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME).tar.gz

gettomee: $(TOMEEPLUS_ZIP)

$(OPENEJB_DIRECTORY)/source-code/tomee/apache-tomee/target:
	cd $(OPENEJB_DIRECTORY)/source-code && mvn clean && svn up
	cd $(OPENEJB_DIRECTORY)/source-code && mvn install -DskipTests=true

$(OPENEJB_DIRECTORY):
	mkdir -p $(OPENEJB_DIRECTORY)
	cd $(OPENEJB_DIRECTORY) && svn co $(OPENEJB_SVN) source-code

kill-tomee:
	@if test -f $(RUNTIME_DIR)/tomee-pid.txt; then \
		kill -9 `cat $(RUNTIME_DIR)/tomee-pid.txt`; \
		rm $(RUNTIME_DIR)/tomee-pid.txt; \
	fi

echo-variables:
	@echo CURRENT_DIR is $(CURRENT_DIR)
	@echo RUNTIME_DIR is $(RUNTIME_DIR)
	@echo OPENEJB_DIRECTORY is $(OPENEJB_DIRECTORY)
	@echo TOMEE_DIRECTORY is $(TOMEE_DIRECTORY)
	@echo TOMEEPLUS_ZIP_NAME is $(TOMEEPLUS_ZIP_NAME)
	@echo TOMEEPLUS_ZIP is $(TOMEEPLUS_ZIP)

pack: echo-variables kill-tomee deploy
	cd $(TOMEE_DIRECTORY) && \
	tar cvzf $(RUNTIME_DIR)/photodb-distribution.tar.gz $(TOMEEPLUS_ZIP_NAME)

start-tomee: echo-variables kill-tomee deploy
	export JPDA_SUSPEND=n && export CATALINA_PID=$(RUNTIME_DIR)/tomee-pid.txt \
		&& export CATALINA_OPTS="-Djava.security.auth.login.config=$(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/login.config" \
		&& $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/bin/catalina.sh jpda start

restart-tomee: echo-variables kill-tomee
	export JPDA_SUSPEND=n && export CATALINA_PID=$(RUNTIME_DIR)/tomee-pid.txt \
		&& export CATALINA_OPTS="-Djava.security.auth.login.config=$(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/login.config" \
		&& $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/bin/catalina.sh jpda start

shutdown-tomee:
	$(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/bin/shutdown.sh

build: clean-log openejb
	mvn clean install -DskipTests=true 

prepare-webapps:
	cd $(TOMEE_DIRECTORY) && rm -rf $(TOMEEPLUS_ZIP_NAME) && tar -xvzf $(TOMEEPLUS_ZIP_NAME).tar.gz
	cp ./photodb-gui/target/photodb-gui.war $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/
	mv $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/photodb-gui.war $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/photodb.war
	cp -f ./tomcat-users.xml $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/
	cp -f ./tomee.xml $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/
	cp -f ./login.config $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/
	cp -f ./loginscript.js $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/

deploy: build gettomee prepare-webapps

run-jasmine:
	cd ./photodb-gui/ && mvn jasmine:bdd

up-static:
	rm -rf $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/photodb/app
	cp -r photodb-gui/src/main/webapp/app $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/photodb/

up-tomee-static:
	rm -Rf $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/tomee/app
	cp -r $(OPENEJB_DIRECTORY)/source-code/tomee/tomee-webapp/src/main/webapp/app $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/tomee/

.PHONY: echo-variables clean clean-log openejb gettomee kill-tomee start-tomee build prepare-webapps deploy run-jasmine
	pack restart-tomee shutdown-tomee up-tomee-static
