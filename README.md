
<div align="center">
    <img src="https://i.imgur.com/H5OI6P6.png" height="150">
    <h2>Net Access Control</h2>
    <p align="center">
        <p>🌍🔐 Control network access to computers in your LAN using NAC</p>
    </p>
</div>

## Contents
* [Purpose](#purpose)
* [Installation](#installation)
* [Usage](#usage)
* [Working](#working)
* [Screenshots](#screenshots)

## Purpose
This app was created to solve the problem of the faculty in our department to have to contact the server room every time they needed internet access in their lab. Also, this process requires the availability of a person in the server room to enable internet access.
This app automates that process of having to contact the server room every time and doesn't depend on the availability of a person in the server room.

## Installation
 - `nodejs  >= v8.9.6` [get it here](https://nodejs.org/en/)
 - Run `npm install` in the root directory.
 - Install squid server for Windows [get it here](http://squid.diladele.com)
 
 ## Usage 
  - Open an elevated terminal i.e. terminal with admin rights
  - Run the express server by typing `node app.js` in the terminal
  - Open your browser and type `localhost:3000`
  - Make sure squid server is running by checking it's status in `services.msc`
  - For squid server log go to _SQUID INSTALLED DIRECTORY_/Squid/var/log/squid and open windows powershell 
  from that path and type `Get-Content access.log -Wait`
  - Add the machine(s)'s ip address(es) to the acl in the `SQUID INSTALLED DIRECTORY/Squid/etc/squid/squid.conf` file and give it a name by adding this line :
  ```
  acl machine_name_here src your_machine_ip_here
  ```
  > NOTE: You can also add a subnet with the ip to add a range of ips.
  - Add a default access control i.e. `allow/deny` to that machine by adding this line:
  ```
  http_access deny your_machine_name_here
  ```
   
  
  ## Working
   - The faculty in charge of the lab has a user ID and password to login to the app. 
   - During the lab he/she just has to enter the labname and press either of the buttons i.e. **ENABLE/DISABLE** to do it's respective action.
   - When the faculty in charge presses enable/disable a request is sent to the express server where the squid proxy server is running and after some file handling operations, a child process is started where it restarts the squid server to reflect the changes of access control list.
 > **NOTE** :  The express server has to be started in an elevated terminal i.e. with administrator rights or it wont be able to restart the squid server, which in turn will not reflect the changes made in the acl.
 
 ## Screenshots
 [Check the screenshots of the app here](https://imgur.com/a/DHita)

  
