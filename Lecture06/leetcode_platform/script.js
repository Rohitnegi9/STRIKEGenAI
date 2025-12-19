document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('code-editor');
    const runBtn = document.getElementById('run-btn');
    const submitBtn = document.getElementById('submit-btn');
    const output = document.getElementById('output');

    runBtn.addEventListener('click', () => {
        const code = codeEditor.value;
        try {
            // WARNING: Using eval() can be a security risk if the code comes from an untrusted source.
            // For a real platform, you would execute code in a secure sandboxed environment.
            const result = eval(code + '\ntwoSum([2,7,11,15], 9);'); // Example test case
            output.textContent = 'Result: ' + JSON.stringify(result);
            console.log('Code executed:', code);
        } catch (error) {
            output.textContent = 'Error: ' + error.message;
            console.error('Code execution error:', error);
        }
    });

    submitBtn.addEventListener('click', () => {
        // In a real LeetCode platform, this would send the code to a backend for evaluation.
        output.textContent = 'Submission successful! (This is a frontend demo. No actual submission.)';
        console.log('Code submitted:', codeEditor.value);
    });
});
