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

HOME_DIR=$(shell cd && pwd)
PROJECT_NAME=photodb

up-static:
	rm -rf $(HOME_DIR)/tomee-runtime/webapps/$(PROJECT_NAME)/app
	cp -r $(PROJECT_NAME)-gui/src/main/webapp/app $(HOME_DIR)/tomee-runtime/webapps/$(PROJECT_NAME)/
	cp -r $(PROJECT_NAME)-gui/src/main/webapp/index.html $(HOME_DIR)/tomee-runtime/webapps/$(PROJECT_NAME)/index.html

up-war: kill-tomee clean-install
	rm -f $(HOME_DIR)/tomee-runtime/webapps/$(PROJECT_NAME).war
	rm -Rf $(HOME_DIR)/tomee-runtime/webapps/$(PROJECT_NAME)
	cp ./$(PROJECT_NAME)-gui/target/$(PROJECT_NAME).war $(HOME_DIR)/tomee-runtime/webapps/

up-war-restart: up-war restart-tomee

clean-start: clean-install start-tomee

clean-install: kill-tomee
	mvn clean install -DskipTests=true

unzip-tomee: kill-tomee
	cd ./$(PROJECT_NAME)-gui/target/ && \
	rm -f tomee-runtime && \
	tar -xzf tomee-runtime.tar.gz && \
	mv apache-tomee-plus-1.5.2-SNAPSHOT tomee-runtime
	cp ./$(PROJECT_NAME)-gui/target/$(PROJECT_NAME).war ./$(PROJECT_NAME)-gui/target/tomee-runtime/webapps
	rm -Rf $(HOME_DIR)/tomee-runtime
	mv ./$(PROJECT_NAME)-gui/target/tomee-runtime $(HOME_DIR)

kill-tomee:
	@if test -f $(HOME_DIR)/tomee-pid.txt; then \
		kill -9 `cat $(HOME_DIR)/tomee-pid.txt`; \
		rm $(HOME_DIR)/tomee-pid.txt; \
	fi

start-tomee: unzip-tomee restart-tomee

tail:
	tail -f $(HOME_DIR)/tomee-runtime/logs/catalina.out

restart-tomee: kill-tomee
	cp -r ./src/main/config/loginscript.js $(HOME_DIR)/tomee-runtime/conf
	export JPDA_SUSPEND=n && \
	export CATALINA_PID=$(HOME_DIR)/tomee-pid.txt && \
	export CATALINA_OPTS="-Djava.security.auth.login.config=$(shell pwd)/src/main/config/login.config -DappRemoteLogin=true" && \
	cd $(HOME_DIR)/tomee-runtime/ && \
	./bin/catalina.sh jpda start

run-jasmine:
	cd ./$(PROJECT_NAME)-gui/ && mvn jasmine:bdd

run-lint:
	cd ./$(PROJECT_NAME)-gui/ && mvn jslint4java:lint

.PHONY: up-war up-war-restart up-static clean-start clean-install unzip-tomee kill-tomee start-tomee restart-tomee \
		run-jasmine run-lint tail

