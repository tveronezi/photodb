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

RUNTIME_DIR=../photodb-runtime
OPENEJB_DIRECTORY=$(RUNTIME_DIR)/openejb
TOMEE_DIRECTORY=$(RUNTIME_DIR)/tomee
TOMEEPLUS_ZIP_NAME=apache-tomee-plus-1.5.1-SNAPSHOT
TOMEEPLUS_ZIP=$(RUNTIME_DIR)/openejb/source-code/tomee/apache-tomee/target/$(TOMEEPLUS_ZIP_NAME).tar.gz

clean-log:
	rm -f $(RUNTIME_DIR)/runtime.log

clean: kill-tomee
	rm -rf $(RUNTIME_DIR)
	mvn clean

openejb: $(OPENEJB_DIRECTORY)

$(TOMEEPLUS_ZIP_NAME):

$(TOMEEPLUS_ZIP): openejb $(TOMEE_DIRECTORY)
	mkdir -p $(TOMEE_DIRECTORY)
	cp $(TOMEEPLUS_ZIP) $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME).tar.gz

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
		&& $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/bin/catalina.sh jpda start

build: clean-log openejb
	mvn clean install -DskipTests=true 

prepare-webapps:
	cd $(TOMEE_DIRECTORY) && rm -rf $(TOMEEPLUS_ZIP_NAME) && tar -xvzf $(TOMEEPLUS_ZIP_NAME).tar.gz
	cp ./photodb-web/target/photodb-web.war $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/
	cp -f ./tomcat-users.xml $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/
	cp -f ./tomee.xml $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/conf/

deploy: build gettomee prepare-webapps

run-jasmine:
	cd ./photodb-web/ && mvn jasmine:bdd

up-static:
	rm -rf $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/photodb-web/app
	cp -r photodb-web/src/main/webapp/app $(TOMEE_DIRECTORY)/$(TOMEEPLUS_ZIP_NAME)/webapps/photodb-web/

.PHONY: clean clean-log openejb gettomee kill-tomee start-tomee build prepare-webapps deploy run-jasmine
