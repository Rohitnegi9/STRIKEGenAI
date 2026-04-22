// =============================================================================
//  PLACEMENT PREDICTOR — Inference Program
//  ---------------------------------------
//  Loads the trained model from disk and predicts the most likely company
//  for any student you type in.
//
//  Flow:
//    1. Read model.txt (architecture + scaler + weights)
//    2. Ask user for: DSA, Projects, IQ, CGPA, Attendance
//    3. Normalize the input USING THE SAME SCALER from training
//       (CRITICAL — a model trained on normalized data will produce
//       garbage if you feed it raw values)
//    4. Forward pass -> softmax probabilities
//    5. Print top company + full probability ranking
// =============================================================================

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
#include <iomanip>

using namespace std;

// -----------------------------------------------------------------------------
//  Loaded model — sizes are read from file, NOT hardcoded.
//  This means if you retrain with a bigger network later, predictor still works.
// -----------------------------------------------------------------------------
struct Model {
    int inputSize, hiddenSize, outputSize;
    vector<double> mean, stdv;       // scaler
    vector<vector<double>> W1;
    vector<double>         b1;
    vector<vector<double>> W2;
    vector<double>         b2;
};

// =============================================================================
//  LOAD MODEL FROM FILE
// =============================================================================
Model loadModel(const string& path) {
    ifstream f(path);
    if (!f.is_open()) {
        cerr << "ERROR: Cannot open model file: " << path << "\n";
        cerr << "Make sure you've trained the model first by running ./placement_nn\n";
        exit(1);
    }

    Model m;
    f >> m.inputSize >> m.hiddenSize >> m.outputSize;

    m.mean.resize(m.inputSize);
    m.stdv.resize(m.inputSize);
    for (int i = 0; i < m.inputSize; i++) f >> m.mean[i];
    for (int i = 0; i < m.inputSize; i++) f >> m.stdv[i];

    m.W1.assign(m.hiddenSize, vector<double>(m.inputSize));
    for (int i = 0; i < m.hiddenSize; i++)
        for (int j = 0; j < m.inputSize; j++)
            f >> m.W1[i][j];

    m.b1.resize(m.hiddenSize);
    for (int i = 0; i < m.hiddenSize; i++) f >> m.b1[i];

    m.W2.assign(m.outputSize, vector<double>(m.hiddenSize));
    for (int i = 0; i < m.outputSize; i++)
        for (int j = 0; j < m.hiddenSize; j++)
            f >> m.W2[i][j];

    m.b2.resize(m.outputSize);
    for (int i = 0; i < m.outputSize; i++) f >> m.b2[i];

    f.close();
    return m;
}

// =============================================================================
//  FORWARD PASS — identical math to the trainer's forward()
//  Input -> Hidden (ReLU) -> Output (Softmax)
// =============================================================================
vector<double> predict(const Model& m, const vector<double>& xRaw) {
    // ----- Normalize input using saved scaler -----
    vector<double> x(m.inputSize);
    for (int j = 0; j < m.inputSize; j++)
        x[j] = (xRaw[j] - m.mean[j]) / m.stdv[j];

    // ----- Hidden layer + ReLU -----
    vector<double> a1(m.hiddenSize);
    for (int i = 0; i < m.hiddenSize; i++) {
        double sum = m.b1[i];
        for (int j = 0; j < m.inputSize; j++)
            sum += m.W1[i][j] * x[j];
        a1[i] = max(0.0, sum);
    }

    // ----- Output layer (logits) -----
    vector<double> z2(m.outputSize);
    for (int i = 0; i < m.outputSize; i++) {
        double sum = m.b2[i];
        for (int j = 0; j < m.hiddenSize; j++)
            sum += m.W2[i][j] * a1[j];
        z2[i] = sum;
    }

    // ----- Softmax (numerically stable) -----
    double maxL = *max_element(z2.begin(), z2.end());
    vector<double> probs(m.outputSize);
    double sum = 0.0;
    for (int i = 0; i < m.outputSize; i++) {
        probs[i] = exp(z2[i] - maxL);
        sum += probs[i];
    }
    for (int i = 0; i < m.outputSize; i++) probs[i] /= sum;
    return probs;
}

// =============================================================================
//  MAIN — interactive prediction loop
// =============================================================================
int main(int argc, char** argv) {
    string modelPath = (argc > 1) ? argv[1] : "model.txt";

    cout << "=================================================\n";
    cout << "   Placement Predictor — Inference Mode\n";
    cout << "=================================================\n";

    Model m = loadModel(modelPath);
    cout << "Model loaded: "
         << m.inputSize  << " inputs -> "
         << m.hiddenSize << " hidden -> "
         << m.outputSize << " companies\n\n";

    while (true) {
        cout << "-------------------------------------------------\n";
        cout << "Enter student details (or type 'q' to quit):\n";

        // Peek for quit
        string first;
        cout << "  DSA Score (0-100)   : ";
        cin >> first;
        if (first == "q" || first == "Q") break;

        vector<double> input(5);
        try {
            input[0] = stod(first);
            cout << "  Projects (0-10)     : "; cin >> input[1];
            cout << "  IQ (80-150)         : "; cin >> input[2];
            cout << "  CGPA (0-10)         : "; cin >> input[3];
            cout << "  Attendance (0-100)  : "; cin >> input[4];
        } catch (...) {
            cout << "Invalid input. Try again.\n";
            continue;
        }

        // Run prediction
        auto probs = predict(m, input);

        // Sort companies by probability (descending) for ranked output
        vector<pair<double,int>> ranked;
        for (int i = 0; i < (int)probs.size(); i++)
            ranked.push_back({probs[i], i});
        sort(ranked.rbegin(), ranked.rend());

        cout << "\n  >>> PREDICTION <<<\n";
        cout << "  Most likely company: " << ranked[0].second
             << "  (confidence: " << fixed << setprecision(2)
             << ranked[0].first * 100 << "%)\n\n";

        cout << "  Full ranking:\n";
        for (auto& [p, c] : ranked) {
            cout << "    Company " << c << " : "
                 << setw(6) << setprecision(2) << p * 100 << "%  ";
            // Visual bar
            int bars = (int)(p * 40);
            for (int i = 0; i < bars; i++) cout << "#";
            cout << "\n";
        }
        cout << "\n";
    }

    cout << "Goodbye!\n";
    return 0;
}
