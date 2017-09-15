# Node.js Plugin

The Node.js plugin will allow you to execute Node.js code in Clarive and view its result.

# What is Node.js?

Node.js is a platform built on Chrome's JavaScript runtime for easily building fast and scalable network applications.
Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for
data-intensive, real-time applications that run across distributed devices.

## Requirements

To be able to use the plugin correctly, you must have Node.js installed on the server where you wish to run the code.

## Installation

To install the plugin, place the `cla-nodejs-plugin` folder inside `CLARIVE_BASE/plugins` directory in the Clarive
instance.

## How to Use

Once the plugin is placed in its folder, you can start using it by going to your Clarive instance.

After restarting your Clarive instance, you will have a new palette service called 'Run Node.js code'.

### Run Node.js Code

The service will execute the code you write in it on the server you specify.  It will create a temporary file with the
code which will be shipped to the specified server.

The parameters available for this service are:

- **Server** - The GenericServer Resource where you wish to execute the code.
- **Node.js path** - Full path for Node.js launching script, including the file. If you leave it empty, the plugin will
  launch *node* as a system environment variable.
- **Node.js parameters** - Additional flags for the Node.js command.
- **Remote temporary path** - Temporary path to which the file with the code will be shipped.
- **Node.js code editor** - Enter here the code you wish to execute.
- **Errors and output** - These two fields deal with managing control errors. The options are:
   - **Fail and output error** - Search for configured error pattern in script output. If found, an error message is
     displayed in the monitor showing the match.
   - **Warning and output warning** - Search for configured warning pattern in script output. If found, an error message
     is displayed in the monitor showing the match.
   - **Custom** - If combo box errors is set to custom, a new form is displayed to define the behavior with these
     fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the monitor.
   - **Warning** - Range of return code values to warn the user. A warning will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the
     monitor.

The plugin will return all the console output you set in the Node.js code.

Configuration example:

      Server: nodejs_server
      Node.js path: /sytem/node.sh
      Node.js parameters: 
      Remote temporal path: /tmp
      Node.js code editor: console.log('This is a nodejs example'); 
