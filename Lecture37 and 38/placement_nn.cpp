// =============================================================================
//  PLACEMENT PREDICTOR — Multiclass Classification Neural Network in C++
//  -------------------------------------------------------------------
//  Built from scratch (no ML libraries) — Coder Army style.
//
//  Architecture:
//     Input Layer   :  5 neurons   (DSA, Projects, IQ, CGPA, Attendance)
//     Hidden Layer  :  16 neurons  + ReLU activation
//     Output Layer  :  10 neurons  + Softmax activation  (10 companies)
//     Loss          :  Cross-Entropy
//     Optimizer     :  Mini-batch Gradient Descent
//
//  WHY THIS ARCHITECTURE?
//  ----------------------
//  Without the hidden layer, the model can only draw STRAIGHT decision
//  boundaries. Real placement data is non-linear:
//     "High CGPA AND low projects" -> different company than
//     "High CGPA AND high projects"
//  The hidden layer learns these INTERACTIONS. ReLU adds the non-linearity
//  by killing negative signals (acts like a switch that lets useful
//  patterns through and blocks the rest).
// =============================================================================

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <cmath>
#include <random>
#include <algorithm>
#include <iomanip>

using namespace std;

// =============================================================================
//  HYPERPARAMETERS (tweak these on stream to show effect)
// =============================================================================
const int    INPUT_SIZE   = 5;       // 5 features
const int    HIDDEN_SIZE  = 16;      // hidden neurons
const int    OUTPUT_SIZE  = 10;      // 10 companies
const double LEARNING_RATE = 0.01;
const int    EPOCHS       = 500;
const int    BATCH_SIZE   = 32;
const double TRAIN_SPLIT  = 0.8;     // 80% train, 20% test

// =============================================================================
//  HELPER: Random number generator (Xavier/He initialization)
// =============================================================================
mt19937 rng(42);  // fixed seed for reproducibility

double randomWeight(int fanIn) {
    // He initialization — good for ReLU
    // std = sqrt(2 / fanIn). Why? Keeps variance of activations stable
    // through layers, prevents vanishing/exploding signals.
    normal_distribution<double> dist(0.0, sqrt(2.0 / fanIn));
    return dist(rng);
}

// =============================================================================
//  DATA STRUCTURES
// =============================================================================
struct Dataset {
    vector<vector<double>> X;   // features  [N x 5]
    vector<int>            y;   // labels    [N]   (0..9 = company id)
};

// =============================================================================
//  CSV LOADER
//  Expected format (no header row needed, but supported):
//     dsa,projects,iq,cgpa,attendance,company_id
//     85,4,120,8.5,90,3
//     ...
// =============================================================================
Dataset loadCSV(const string& path) {
    Dataset data;
    ifstream file(path);
    if (!file.is_open()) {
        cerr << "ERROR: Cannot open file " << path << endl;
        exit(1);
    }

    string line;
    bool firstLine = true;
    while (getline(file, line)) {
        if (line.empty()) continue;

        // Skip header if first cell is non-numeric
        if (firstLine) {
            firstLine = false;
            if (!isdigit(line[0]) && line[0] != '-' && line[0] != '.') continue;
        }

        stringstream ss(line);
        string cell;
        vector<double> row;
        while (getline(ss, cell, ',')) {
            row.push_back(stod(cell));
        }

        if (row.size() != INPUT_SIZE + 1) {
            cerr << "WARNING: skipping malformed row (got "
                 << row.size() << " cols, expected " << INPUT_SIZE + 1 << ")\n";
            continue;
        }

        vector<double> features(row.begin(), row.begin() + INPUT_SIZE);
        int label = (int)row.back();
        data.X.push_back(features);
        data.y.push_back(label);
    }
    return data;
}

// =============================================================================
//  FEATURE NORMALIZATION (Z-score / Standardization)
//  -----------------------------------------------
//  CRITICAL: Without this, IQ (~120) dominates CGPA (~8) just because of
//  scale, not because it's more important. We rescale every feature to
//  have mean=0, std=1 so the network learns based on PATTERN, not magnitude.
// =============================================================================
struct Scaler {
    vector<double> mean, std;
};

Scaler fitScaler(const vector<vector<double>>& X) {
    Scaler s;
    s.mean.assign(INPUT_SIZE, 0.0);
    s.std.assign(INPUT_SIZE, 0.0);
    int N = X.size();

    for (auto& row : X)
        for (int j = 0; j < INPUT_SIZE; j++)
            s.mean[j] += row[j];
    for (int j = 0; j < INPUT_SIZE; j++) s.mean[j] /= N;

    for (auto& row : X)
        for (int j = 0; j < INPUT_SIZE; j++)
            s.std[j] += (row[j] - s.mean[j]) * (row[j] - s.mean[j]);
    for (int j = 0; j < INPUT_SIZE; j++) {
        s.std[j] = sqrt(s.std[j] / N);
        if (s.std[j] < 1e-8) s.std[j] = 1.0; // avoid div-by-zero
    }
    return s;
}

void applyScaler(vector<vector<double>>& X, const Scaler& s) {
    for (auto& row : X)
        for (int j = 0; j < INPUT_SIZE; j++)
            row[j] = (row[j] - s.mean[j]) / s.std[j];
}

// =============================================================================
//  THE NEURAL NETWORK
// =============================================================================
struct NeuralNet {
    // Weights & biases
    vector<vector<double>> W1;  // [HIDDEN x INPUT]
    vector<double>         b1;  // [HIDDEN]
    vector<vector<double>> W2;  // [OUTPUT x HIDDEN]
    vector<double>         b2;  // [OUTPUT]

    // Cached values for backprop (filled during forward pass)
    vector<double> z1, a1;      // hidden pre-activation & post-activation
    vector<double> z2, a2;      // output pre-activation & softmax output

    NeuralNet() {
        W1.assign(HIDDEN_SIZE, vector<double>(INPUT_SIZE));
        b1.assign(HIDDEN_SIZE, 0.0);
        W2.assign(OUTPUT_SIZE, vector<double>(HIDDEN_SIZE));
        b2.assign(OUTPUT_SIZE, 0.0);

        for (int i = 0; i < HIDDEN_SIZE; i++)
            for (int j = 0; j < INPUT_SIZE; j++)
                W1[i][j] = randomWeight(INPUT_SIZE);

        for (int i = 0; i < OUTPUT_SIZE; i++)
            for (int j = 0; j < HIDDEN_SIZE; j++)
                W2[i][j] = randomWeight(HIDDEN_SIZE);
    }

    // -------------------------------------------------------------------------
    //  FORWARD PASS
    //  Input  ->  Hidden (ReLU)  ->  Output (Softmax)
    // -------------------------------------------------------------------------
    vector<double> forward(const vector<double>& x) {
        // ----- Layer 1: Hidden -----
        z1.assign(HIDDEN_SIZE, 0.0);
        a1.assign(HIDDEN_SIZE, 0.0);
        for (int i = 0; i < HIDDEN_SIZE; i++) {
            double sum = b1[i];
            for (int j = 0; j < INPUT_SIZE; j++)
                sum += W1[i][j] * x[j];
            z1[i] = sum;
            a1[i] = max(0.0, sum);   // ReLU: keep positive, zero out negative
        }

        // ----- Layer 2: Output (logits) -----
        z2.assign(OUTPUT_SIZE, 0.0);
        for (int i = 0; i < OUTPUT_SIZE; i++) {
            double sum = b2[i];
            for (int j = 0; j < HIDDEN_SIZE; j++)
                sum += W2[i][j] * a1[j];
            z2[i] = sum;
        }

        // ----- Softmax: convert logits to probabilities -----
        // Subtract max for numerical stability (prevents exp overflow)
        double maxLogit = *max_element(z2.begin(), z2.end());
        a2.assign(OUTPUT_SIZE, 0.0);
        double expSum = 0.0;
        for (int i = 0; i < OUTPUT_SIZE; i++) {
            a2[i] = exp(z2[i] - maxLogit);
            expSum += a2[i];
        }
        for (int i = 0; i < OUTPUT_SIZE; i++) a2[i] /= expSum;

        return a2;
    }

    // -------------------------------------------------------------------------
    //  BACKWARD PASS (Backpropagation)
    //  Returns gradients to be accumulated for batch update.
    //
    //  KEY INSIGHT (the Rohit derivation):
    //  Each weight gets blamed in proportion to the input flowing into it.
    //  We compute that blame layer-by-layer, propagating from output backward.
    //
    //  For softmax + cross-entropy, the gradient at the output layer
    //  collapses to a beautifully simple form:
    //      dL/dz2[i] = a2[i] - y_onehot[i]
    //  (the predicted probability minus the true label)
    // -------------------------------------------------------------------------
    void backward(const vector<double>& x, int trueLabel,
                  vector<vector<double>>& dW1, vector<double>& db1,
                  vector<vector<double>>& dW2, vector<double>& db2) {

        // ----- Output layer gradient: (predicted - actual) -----
        vector<double> dz2(OUTPUT_SIZE);
        for (int i = 0; i < OUTPUT_SIZE; i++) {
            dz2[i] = a2[i] - (i == trueLabel ? 1.0 : 0.0);
        }

        // ----- Gradients for W2 and b2 -----
        // dW2[i][j] = dz2[i] * a1[j]   <-- "error * input flowing in"
        for (int i = 0; i < OUTPUT_SIZE; i++) {
            for (int j = 0; j < HIDDEN_SIZE; j++)
                dW2[i][j] += dz2[i] * a1[j];
            db2[i] += dz2[i];
        }

        // ----- Backprop into hidden layer -----
        // First: how much error reached each hidden neuron?
        // da1[j] = sum over i of (W2[i][j] * dz2[i])
        vector<double> da1(HIDDEN_SIZE, 0.0);
        for (int j = 0; j < HIDDEN_SIZE; j++) {
            for (int i = 0; i < OUTPUT_SIZE; i++)
                da1[j] += W2[i][j] * dz2[i];
        }

        // Then: pass through ReLU derivative (1 if z1>0, else 0)
        vector<double> dz1(HIDDEN_SIZE);
        for (int j = 0; j < HIDDEN_SIZE; j++)
            dz1[j] = (z1[j] > 0) ? da1[j] : 0.0;

        // ----- Gradients for W1 and b1 -----
        // dW1[j][k] = dz1[j] * x[k]   <-- same "error * input" pattern!
        for (int j = 0; j < HIDDEN_SIZE; j++) {
            for (int k = 0; k < INPUT_SIZE; k++)
                dW1[j][k] += dz1[j] * x[k];
            db1[j] += dz1[j];
        }
    }

    // -------------------------------------------------------------------------
    //  APPLY GRADIENTS (after a mini-batch)
    //  w_new = w_old - learning_rate * gradient
    // -------------------------------------------------------------------------
    void applyGradients(const vector<vector<double>>& dW1, const vector<double>& db1,
                        const vector<vector<double>>& dW2, const vector<double>& db2,
                        int batchSize) {
        double scale = LEARNING_RATE / batchSize;
        for (int i = 0; i < HIDDEN_SIZE; i++) {
            for (int j = 0; j < INPUT_SIZE; j++)
                W1[i][j] -= scale * dW1[i][j];
            b1[i] -= scale * db1[i];
        }
        for (int i = 0; i < OUTPUT_SIZE; i++) {
            for (int j = 0; j < HIDDEN_SIZE; j++)
                W2[i][j] -= scale * dW2[i][j];
            b2[i] -= scale * db2[i];
        }
    }
};

// =============================================================================
//  SAVE MODEL TO FILE
//  ------------------
//  We write everything the predictor needs:
//    1. Architecture sizes  (so predictor can validate)
//    2. Scaler (mean & std) (so predictor normalizes input the same way)
//    3. W1, b1, W2, b2      (the trained weights & biases)
//
//  Format: plain text, one number per line. Easy to inspect, no binary headaches.
// =============================================================================
void saveModel(const NeuralNet& net, const Scaler& scaler, const string& path) {
    ofstream f(path);
    if (!f.is_open()) {
        cerr << "ERROR: Cannot write to " << path << endl;
        return;
    }
    f << fixed << setprecision(8);

    // Architecture
    f << INPUT_SIZE << " " << HIDDEN_SIZE << " " << OUTPUT_SIZE << "\n";

    // Scaler: mean then std
    for (double m : scaler.mean) f << m << " ";
    f << "\n";
    for (double s : scaler.std) f << s << " ";
    f << "\n";

    // W1 [HIDDEN x INPUT]
    for (int i = 0; i < HIDDEN_SIZE; i++) {
        for (int j = 0; j < INPUT_SIZE; j++) f << net.W1[i][j] << " ";
        f << "\n";
    }
    // b1
    for (double b : net.b1) f << b << " ";
    f << "\n";

    // W2 [OUTPUT x HIDDEN]
    for (int i = 0; i < OUTPUT_SIZE; i++) {
        for (int j = 0; j < HIDDEN_SIZE; j++) f << net.W2[i][j] << " ";
        f << "\n";
    }
    // b2
    for (double b : net.b2) f << b << " ";
    f << "\n";

    f.close();
    cout << "\nModel saved to: " << path << "\n";
}

// =============================================================================
//  CROSS-ENTROPY LOSS
//  L = -log(predicted_probability_of_true_class)
//  Small if model is confident & correct; large if wrong or unsure.
// =============================================================================
double crossEntropyLoss(const vector<double>& probs, int trueLabel) {
    double p = max(probs[trueLabel], 1e-12); // avoid log(0)
    return -log(p);
}

// =============================================================================
//  EVALUATE accuracy on a dataset
// =============================================================================
double evaluate(NeuralNet& net, const Dataset& data) {
    int correct = 0;
    for (size_t i = 0; i < data.X.size(); i++) {
        auto probs = net.forward(data.X[i]);
        int pred = max_element(probs.begin(), probs.end()) - probs.begin();
        if (pred == data.y[i]) correct++;
    }
    return 100.0 * correct / data.X.size();
}

// =============================================================================
//  TRAIN/TEST SPLIT (shuffled)
// =============================================================================
pair<Dataset, Dataset> trainTestSplit(const Dataset& data, double trainFrac) {
    int N = data.X.size();
    vector<int> idx(N);
    iota(idx.begin(), idx.end(), 0);
    shuffle(idx.begin(), idx.end(), rng);

    int trainN = (int)(N * trainFrac);
    Dataset train, test;
    for (int i = 0; i < N; i++) {
        if (i < trainN) {
            train.X.push_back(data.X[idx[i]]);
            train.y.push_back(data.y[idx[i]]);
        } else {
            test.X.push_back(data.X[idx[i]]);
            test.y.push_back(data.y[idx[i]]);
        }
    }
    return {train, test};
}

// =============================================================================
//  MAIN
// =============================================================================
int main(int argc, char** argv) {
    string csvPath = (argc > 1) ? argv[1] : "placement_data.csv";

    cout << "=================================================\n";
    cout << "  Placement Predictor — Coder Army Neural Net\n";
    cout << "=================================================\n";
    cout << "Loading data from: " << csvPath << "\n";

    Dataset data = loadCSV(csvPath);
    cout << "Loaded " << data.X.size() << " samples.\n\n";

    // Split
    auto [train, test] = trainTestSplit(data, TRAIN_SPLIT);
    cout << "Train: " << train.X.size() << "  |  Test: " << test.X.size() << "\n";

    // Normalize (fit on train only — never peek at test!)
    Scaler scaler = fitScaler(train.X);
    applyScaler(train.X, scaler);
    applyScaler(test.X, scaler);

    // Build network
    NeuralNet net;

    // ----- TRAINING LOOP -----
    cout << "\nTraining for " << EPOCHS << " epochs...\n";
    cout << "-------------------------------------------------\n";

    vector<int> indices(train.X.size());
    iota(indices.begin(), indices.end(), 0);

    for (int epoch = 1; epoch <= EPOCHS; epoch++) {
        shuffle(indices.begin(), indices.end(), rng);
        double epochLoss = 0.0;

        for (size_t start = 0; start < indices.size(); start += BATCH_SIZE) {
            size_t end = min(start + BATCH_SIZE, indices.size());

            // Zero out batch gradients
            vector<vector<double>> dW1(HIDDEN_SIZE, vector<double>(INPUT_SIZE, 0.0));
            vector<double>         db1(HIDDEN_SIZE, 0.0);
            vector<vector<double>> dW2(OUTPUT_SIZE, vector<double>(HIDDEN_SIZE, 0.0));
            vector<double>         db2(OUTPUT_SIZE, 0.0);

            // Accumulate gradients across the mini-batch
            for (size_t k = start; k < end; k++) {
                int i = indices[k];
                auto probs = net.forward(train.X[i]);
                epochLoss += crossEntropyLoss(probs, train.y[i]);
                net.backward(train.X[i], train.y[i], dW1, db1, dW2, db2);
            }

            net.applyGradients(dW1, db1, dW2, db2, end - start);
        }

        if (epoch == 1 || epoch % 50 == 0 || epoch == EPOCHS) {
            double avgLoss = epochLoss / train.X.size();
            double trainAcc = evaluate(net, train);
            double testAcc  = evaluate(net, test);
            cout << "Epoch " << setw(4) << epoch
                 << " | Loss: " << fixed << setprecision(4) << avgLoss
                 << " | Train Acc: " << setprecision(2) << trainAcc << "%"
                 << " | Test Acc: " << testAcc << "%\n";
        }
    }

    cout << "\n=================================================\n";
    cout << "  Training complete!\n";
    cout << "=================================================\n";



    // Persist trained model + scaler so the predictor can use it
    saveModel(net, scaler, "model.txt");

    return 0;
}