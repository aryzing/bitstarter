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
function sync(){
  var done=false;
  var out=undefined;
  async('complete', treatresult(url, checksifle, done));
  while (done == false) {}
  return out;
}
function cheerioHtmlUrl(url,checksfile,$,done){
  return function(result){
    $=cheerio.load(result);
    done=true;
  }
}
var checkHtmlUrl= function(url, checksfile) {
  var done=false;
  var out=undefined;
  var $;
  console.log("i am here");
  rest.get(url).on('complete', function(result){console.log("hi");});
  var checks = loadChecks(checksfile).sort();
  console.log("right before loop");
  while(done==false){}//console.log(done);}
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  return out;
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

  var checkJson, outJson;
  if(program.url){
    console.log(program.url);
    checkJson=checkHtmlUrl(program.url, program.checks); 
    outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
  }
  else if(program.file){
    checkJson = checkHtmlFile(program.file, program.checks);
    outJson = JSON.stringify(checkJson, null, 4);
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
