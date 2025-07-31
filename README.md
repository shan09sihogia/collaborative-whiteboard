# Collaborative Whiteboard

A full-stack, real-time web application that allows multiple users to draw on a shared canvas simultaneously.

## 🚀 Key Features

* **Real-Time Drawing:** Instantly synchronize drawing actions across all connected clients.
* **Customizable Tools:** Users can select different colors and brush sizes.
* **Clear Canvas:** A button to reset the canvas for a new drawing session.
* **Responsive UI:** A clean and elegant user interface that works on different screen sizes.

## ⚙️ Technologies Used

* **Front-End:**
    * **React:** The core JavaScript library for building the user interface.
    * **React Hooks:** Utilized `useState`, `useEffect`, and `useRef` for state management and DOM manipulation.
    * **TailwindCSS:** A utility-first CSS framework for rapid and responsive styling.
    * **Socket.IO Client:** For establishing a real-time connection to the server.

* **Back-End:**
    * **Node.js:** The JavaScript runtime environment.
    * **Express.js:** A minimalist web framework for setting up the server.
    * **Socket.IO Server:** For enabling bi-directional, real-time communication between the clients and the server.

## 🌐 How It Works

The front-end client sends drawing coordinates and brush settings to the Node.js server using WebSockets. The server then broadcasts this data to all other connected clients, which redraw the lines on their respective canvases in real time.

## 🔧 Getting Started

### **Prerequisites**

* Node.js (LTS version recommended)
* npm (comes with Node.js)

### **Installation**

1.  Clone the repository:
    ```bash
    git clone [https://github.com/shan09sihogia/collaborative-whiteboard.git](https://github.com/shan09sihogia/collaborative-whiteboard.git)
    ```
2.  Navigate to the project root:
    ```bash
    cd collaborative-whiteboard
    ```
3.  Install front-end dependencies:
    ```bash
    cd my-whiteboard-app
    npm install
    ```
4.  Install back-end dependencies:
    ```bash
    cd ../server
    npm install
    ```

### **Running the Application**

1.  Start the back-end server in one terminal:
    ```bash
    cd collaborative-whiteboard/server
    node index.js
    ```
2.  Start the front-end application in a second terminal:
    ```bash
    cd collaborative-whiteboard/my-whiteboard-app
    npm run dev
    ```

The application will be available at `http://localhost:5173`. You can open this link in multiple tabs or browsers to test the real-time collaboration.

## 🧑‍💻 Author

* **Shan Sihogia** - [GitHub Profile](https://github.com/shan09sihogia)
