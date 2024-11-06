
:::::::::::::::::: FOR LOCAL SERVER ::::::::::::::::::
Open cmd (Add path) --> 
python -m http.server 8000

Open your browser and go to (to view the site) -->
http://localhost:8000 


:::::::::::::::::: FOR LINUX SERVER ::::::::::::::::::
Open cmd --> 
wsl --install (Optional, if not installed)
sudo apt update && sudo apt upgrade -y (Optional, if not installed)

Add you path --> (I'm adding my case)
cd /mnt/c/Users/Santhoshkr/Documents/SandyDOCS/WorkDocs/Projects/OtherTasks/Server_Microphone/Code

To run in server -->
python3 -m http.server 8000

Now, Go to view your microphone testing served in Linux environment in WSL -->
http://localhost:8000



:::::::::::::::::: OTHER LINUX WAYS ::::::::::::::::::
Alternative Server -->
You can also install a lightweight web server like "Nginx or Apache" on WSL 
(if you plan to use this for longer-term development.)

Open bash -->
sudo apt install nginx -y

Start Nginx -->
sudo service nginx start

Now, Place your files in -->
/var/www/html/ (i.e. directory or configure Nginx to serve files from your project directory.)