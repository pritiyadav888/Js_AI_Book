# Chapter 1: Exercise 1.1 - Setting Up Your Development Environment

This exercise sets up your environment for AI and JavaScript. We use VS Code, npm, Node.js, and Express.js. A basic React project is also created (though used later).

**1. Installing Node.js and npm:**

Node.js and npm (Node Package Manager) are essential. npm installs dependencies.

1.  Check installation: Open your terminal and type `node -v` and `npm -v`. Version numbers indicate they are installed.
2.  If not installed: Download and install Node.js from [https://nodejs.org/](https://nodejs.org/). npm comes bundled.

**2. Installing VS Code:**

1.  Download VS Code from: [https://code.visualstudio.com/download](https://code.visualstudio.com/download)
2.  Install as per your operating system's instructions.

**3. Setting up Your Project:**

1.  Clone the repo: `git clone <your_repo_url>`
2.  Open the cloned repository in VS Code.

**4. Creating the Backend Project (`backend` directory):**

1.  Open a terminal.
2.  Navigate: `cd javascript-ai-movie-recs/backend`
3.  Initialize: `npm init -y`
4.  Install Express.js: `npm install express`

**5. Creating the Frontend Project (`frontend` directory):**

1.  Navigate: `cd ../frontend`
2.  Create React project: `npx create-react-app .` (or `yarn create react-app .`)
3.  Navigate back: `cd ..`

**6. Setting up the `chapter_1` Project:**

1.  Navigate: `cd chapter_1`
2.  Initialize: `npm init -y`
3.  Install TensorFlow.js and other packages:
    ```bash
    npm install @tensorflow/tfjs express
    ```

**7. Verifying Your Setup (`ex_1_setup.js`):**

Run `ex_1_setup.js` from your `chapter_1` terminal. It checks for Node.js, TensorFlow.js, and Express.js.

**Error Handling:**

If you encounter errors:

- **"Cannot find module '...'":** The required package (`@tensorflow/tfjs` or `express`) is not installed. Use `npm install <package_name>` to install it. Always make sure that you are connected to the internet. If you still have issues try `npm cache clean --force` followed by the `npm install` command.
- **Other Errors:** Check your network connectivity, your Node.js version, and that you are in the correct directory. Carefully review the installation steps.

**8. (Optional) Installing Recommended VS Code Extensions:**

Install these for a better experience:

- ESLint
- Prettier
- Bracket Pair Colorizer

**(Refer to Appendix A and B for detailed installation instructions if needed.)**
