#!/bin/bash
# Create Project with ATLANTIQ Core #
################################

AQ_CORE_DIR="/home/cositsch/public_html/drupal.atlantiq.ch"
php_drush="/usr/local/bin/php81 vendor/drush/drush/drush"
# Funktion definieren
php_drush_uuid() {
    $php_drush uuid
}

AQ_CORE_WEBROOT="$AQ_CORE_DIR/webroot"

WEBROOT_DIR=webroot
DRUPAL_DIR=$WEBROOT_DIR/web

# Checkout absolute project path
# Works if this file is located in subdirectory of project path
cd ..
PROJECT_PATH=$(pwd)

PROJECT_WEBROOT=$PROJECT_PATH/$WEBROOT_DIR
DRUPAL_ROOT=$PROJECT_PATH/$DRUPAL_DIR
SETTINGS_FILE="$DRUPAL_ROOT/sites/default/settings.php"

now=$(date +"%Y_%m_%d__%H_%M_%S")

#---------- do not edit below ------------
# simple prompt
prompt_yes_no() {
  while true ; do
    printf "$* [Y/n] "
        read -r answer
        if [ -z "$answer" ] ; then
    return 0
        fi
    case $answer in
        [Yy]|[Yy][Ee][Ss])
          return 0
          ;;
        [Nn]|[Nn][Oo])
          return 1
          ;;
        *)
          echo "Please answer yes or no"
          ;;
      esac
  done
}

#**********************************************************************#
# Export the Core

if prompt_yes_no "EXPORT the DB and Configurations from ATLANTIQ Core?" ; then

  cd $AQ_CORE_WEBROOT || { echo "Failure, cd to folder not happen."; exit 1; }

  echo "$(date +%Y-%m-%d__%H_%M_%S): SET the MAINTANENANCE MODE to 1"
  $php_drush sset system.maintenance_mode TRUE

  echo "$(date +%Y-%m-%d__%H_%M_%S): CLEAR Cache"
  $php_drush cr

  echo "$(date +%Y-%m-%d__%H_%M_%S): EXPORT the configuration files"
  $php_drush cex

  echo "$(date +%Y-%m-%d__%H_%M_%S): CREATE SQL Dump"
  $php_drush sql-dump > ../backup/sync/db/$now.sql --extra-dump=--no-tablespaces

  echo "$(date +%Y-%m-%d__%H_%M_%S): SET the MAINTANENANCE MODE to 0"
  $php_drush sset system.maintenance_mode FALSE

  echo "$(date +%Y-%m-%d__%H_%M_%S): CLEAR Cache"
  $php_drush cr

  echo "$(date +%Y-%m-%d__%H_%M_%S): END of export ALTANTIQ Core."
fi

#**********************************************************************#
# COPY Core

if prompt_yes_no "CREATE a new project with ATLANTIQ Core from path $AQ_CORE_DIR to path $PROJECT_PATH?" ; then

  echo "$(date +%Y-%m-%d__%H_%M_%S): START Copy"
  echo "$(date +%Y-%m-%d__%H_%M_%S): COPY ALTANTIQ Core from $AQ_CORE_DIR to $PROJECT_PATH"

  # Copy whole ATLANTIQ Core
  cp -Rn $AQ_CORE_DIR/* $PROJECT_PATH/

  echo "$(date +%Y-%m-%d__%H_%M_%S): END Copy"
  echo "$(date +%Y-%m-%d__%H_%M_%S): IMPORTANT: Please change the DB-Credentials AND trusted_host_patterns in the file: $SETTINGS_FILE"

fi

#**********************************************************************#
# Initialize the Core

if prompt_yes_no "Do you changed the 'DB-Credentials' AND 'trusted_host_patterns' in the file $SETTINGS_FILE?" ; then
  if prompt_yes_no "Do you wanna initialize the new project?" ; then

    cd $PROJECT_WEBROOT || { echo "Failure, cd to folder not happen."; exit 1; }

    if prompt_yes_no "IMPORT the DB form ATLANTIQ Core?" ; then
        echo "$(date +%Y-%m-%d__%H_%M_%S): IMPORT the ATLANTIQ Core DB $now.sql if available"
        if test -e "../backup/sync/db/$now.sql"; then
            echo "$(date +%Y-%m-%d__%H_%M_%S): DROP the old DB"
            $php_drush sql-drop
            $php_drush sql-cli < ../backup/sync/db/$now.sql
        else
            echo "No file $now.sql found"
        fi
    fi

    echo "$(date +%Y-%m-%d__%H_%M_%S): CLEAR Cache"
    $php_drush cr

    echo "$(date +%Y-%m-%d__%H_%M_%S): SET the MAINTANENANCE MODE to 1"
    $php_drush sset system.maintenance_mode TRUE

    echo "$(date +%Y-%m-%d__%H_%M_%S): CLEAR cache again"
    $php_drush cr

    # Not needed right now.
    # echo "$(date +%Y-%m-%d__%H_%M_%S): IMPORT the configuration files"
    # $php_drush cim

    echo "$(date +%Y-%m-%d__%H_%M_%S): GENERATE new UUID for the new project"
    UUID_NUMBER=$(php_drush_uuid)
    echo "$(date +%Y-%m-%d__%H_%M_%S): OVERRIDE old system UUID with new UUID: $UUID_NUMBER"
    $php_drush cset system.site uuid $UUID_NUMBER

    echo "$(date +%Y-%m-%d__%H_%M_%S): SET the MAINTANENANCE MODE to 0"
    $php_drush sset system.maintenance_mode FALSE

    echo "$(date +%Y-%m-%d__%H_%M_%S): EXPORT the new configuration files"
    $php_drush cex

    echo "$(date +%Y-%m-%d__%H_%M_%S): CLEAR cache"
    $php_drush cr

    echo "$(date +%Y-%m-%d__%H_%M_%S): GONGRATULATIONS! You can now use the new project."
  fi
fi

