# Togather

#Setting up the App

1. In the root directory run the following command (in Git Bash ideally) to install the relevant dependencies
> npm install

2. Build the app by running the following command in the terminal
> npm run start

3. Once the app is built, a QR code should pop up in the terminal. You can either
   a. Install Expo Go on your mobile phone and scan the QR code
   b. Run a virtual device on Android Studio.
     i. When the app is built, start up the virtual device.
     ii. Press "a" in the terminal to install the Expo Go app on the virtual device and run the app
     iii. If asked whether rooting the phone is allowed, click "Allow"

4. For the location service to run properly, you need to turn on location on your phone. For the virtual device, you will have to manually set a location. Reference the following document with attached screenshots
https://docs.google.com/document/d/1Nl6zBIEJ0efOY8To5ikc6ebh7fIGLHJ46I16ttUShr8/edit?usp=sharing

#Backend and database servive
The backend is hosted in an online service called Render.com. But there might be occassions where the service unfortunately shutdown. This is usually indicated when you are unable to sign in using the default account "jane@test.com". A modal will appear, indicating "Invalid credentials". Or if the Discovery screen is completely empty, this is also an indicator that the hosting service is failing. In this case, you will need to set up the backend manually following the coming steps.

1. In the terminal, using Git bash on windows ideally, run
> ipconfig
2. Copy the address under "Wireless LAN adapter Wi-Fi:", next to "IPv4 Address"
3. Navigate to the "api" folder, there should be four TypeScript files "community.ts", "event.ts", "post.ts" and "user.ts".
4. For each of the files, there is a "API_URL variable", replace it with the string
> https://{copied_ip_address}:8000
5. In the terminal, from the root directory, run
> cd backend
6. You should be redirected to the "backend" folder
7. Create a virtual environment by running (in Git Bash ideally)
> source venv/Scripts/activate
8. Install required packages by running
> pip install -r requirements.txt
9. Finally, start the server by running
> uvicorn main:app --host 0.0.0.0 --port 8000

#Potential issues
Ocassionally, when trying to start the app by scanning the QR code or pressing "a" in the terminal, you might be stuck in a loading screen, and the app will simply not run. Please try uninstalling and reinstalling Expo GO in this case. Or if on Android studio, temrinating the virtual device, wiping the data, running it again might work.

   
