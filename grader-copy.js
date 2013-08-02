#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var sys = require('util');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://calm-brushlands-3751.herokuapp.com/";

//Common functions for both files and urls
var assertFileExists = function(infile) {
  var instr = infile.toString();
  if(!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
  }
  return instr;
};
var loadChecks = function(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
};
//Functions for urls
function treatresult(url,checksfile){
  return function(result){
    //console.log("Web retrieved");
    var $=cheerio.load(result);
    var checks = loadChecks(checksfile).sort();
    var checkJson = {};
    for(var ii in checks) {
      var present = $(checks[ii]).length > 0;
      checkJson[checks[ii]] = present;
    }
    var outJson=JSON.stringify(checkJson, null, 4);
    console.log(outJson);
  }
}
var dummyfn=function(result){
  console.log("entry succesful");
}
var checkHtmlUrl= function(url, checksfile) {
  //console.log(url);
  rest.get(url).on('complete', function(result){console.log("second entry");});
};

//functions for files
cheerioHtmlFile = function(htmlfile) {
  return cheerio.load(fs.readFileSync(htmlfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
  $ = cheerioHtmlFile(htmlfile);
  var checks = loadChecks(checksfile).sort();
  var out = {};
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  return out;
};
//auxiliary function
var clone = function(fn) {
  // Workaround for commander.js issue.
  // http://stackoverflow.com/a/6772648
  return fn.bind({});
};

if(require.main === module) {
  program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-u, --url [url]','url of website to analyze')
    .option('-f, --file [filename]','filename of file to analyze')
    .parse(process.argv);

  if(program.url){
    checkHtmlUrl(program.url, program.checks); 
  }
  else if(program.file){
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
  }
  else{
    console.log("Please provide either a -u [URL] OR -f [filename]");
  }
}
else {
  exports.checkHtmlFile = checkHtmlFile;
  exports.checkHtmlUrl = checkHtmlUrl;
}
