#!/usr/bin/env node

/* 
 * Este archivo se encarga de modificar el archivo manifest la parte de Configuración de seguridad de la red - con el fin de solventar la vulnerabilidad  RQVULSEC-2595
 */
module.exports = function(context) {
    var ANDROID = 'android';
    var platformsList = context.opts.platforms;
                    runModifyManifest(context);
};


function runModifyManifest(context) {

    let fs = context.require('fs'),
        path = context.require('path');

    // android platform directory
    let platformAndroidDir = path.join(context.opts.projectRoot, 'platforms/android');

    // android app module directory
    let platformAndroidAppModuleDir = path.join(platformAndroidDir, 'app');

    // android manifest file
    let androidManifestFile = path.join(platformAndroidAppModuleDir, 'src/main/AndroidManifest.xml');

    if (fs.existsSync(androidManifestFile)) {

        fs.readFile(androidManifestFile, 'UTF-8', function(err, data) {
            if (err) {
                throw new Error('Unable to find AndroidManifest.xml: ' + err);
            }
            // the Android Application class that need to config to Android manifest file
            let applicationTheme = 'android:theme="@style/AppThemeOne"';

            let incorrectTheme = 'android:theme="@style/AppTheme.NoActionBar"';
            var result = '';
            if (data.indexOf(incorrectTheme) != -1) {
                result = data.replace(incorrectTheme, applicationTheme);
            } else if (data.indexOf('@style/AppThemeOne') === -1) {
                result = data.replace(/<application/g, '<application ' + applicationTheme);
            }


            let applicationThemeActivity = 'android:theme="@style/AppThemeOne"';
            let incorrectThemeActivity = 'android:theme="@android:style/Theme.DeviceDefault.NoActionBar"';
            if (result != '') {
                if (data.indexOf(incorrectThemeActivity) != -1) {
                    result = result.replace(incorrectThemeActivity, applicationThemeActivity);
                } else if (data.indexOf('@style/AppThemeOne') === -1) {
                    result = result.replace(/<activity/g, '<activity ' + applicationThemeActivity);
                }
            } else {
                if (data.indexOf(incorrectThemeActivity) != -1) {
                    result = data.replace(incorrectThemeActivity, applicationThemeActivity);
                } else if (data.indexOf('@style/AppThemeOne') === -1) {
                    result = data.replace(/<activity/g, '<activity ' + applicationThemeActivity);
                }
            }
                
          
            if (result != '') {
                fs.writeFile(androidManifestFile, result, 'UTF-8', function(err) {
                    if (err)
                        throw new Error('Unable to write into AndroidManifest.xml: ' + err);
                })
            }
        });
    }
}


function runModifyNetworkConfig(context) {

    let fs = context.require('fs'),
        path = context.require('path');

    // android platform directory
    let platformAndroidDir = path.join(context.opts.projectRoot, 'platforms/android');

    // android app module directory
    let platformAndroidAppModuleDir = path.join(platformAndroidDir, 'app');

    let networkSecurityConfigFile = path.join(platformAndroidAppModuleDir, 'src/main/res/xml/network_security_config.xml');

    if (fs.existsSync(networkSecurityConfigFile)) {

        fs.readFile(networkSecurityConfigFile, 'UTF-8', function(err, data) {
            if (err) {
                throw new Error('Unable to find network_security_config.xml: ' + err);
            }

            // the Android Application class that need to config to Android manifest file
            let networkSecurityConfigCertificates = '<certificates src="user" />';

            if (data.indexOf(networkSecurityConfigCertificates) != -1) {
                var result1 = data.replace(networkSecurityConfigCertificates, '');
            }


            if (result1 != undefined && result1 != null) {
                fs.writeFile(networkSecurityConfigFile, result1, 'UTF-8', function(err) {
                    if (err)
                        throw new Error('Unable to write into network_security_config.xml: ' + err);
                })
            }
        });
    }
}
