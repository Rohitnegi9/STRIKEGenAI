#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>

using namespace std;


struct Example {
    double study;
    double sleep;
    double marks;
};


vector<Example> loadDataset(string filename) {
    vector<Example> data;
    ifstream file(filename);
    string line;

    getline(file, line); // skip header

    while (getline(file, line)) {
        stringstream ss(line);
        string val;
        Example e;

        getline(ss, val, ','); e.study = stod(val);
        getline(ss, val, ','); e.sleep = stod(val);
        getline(ss, val, ','); e.marks = stod(val);

        data.push_back(e);
    }
    return data;
}


double predict(double study, double sleep,
               double w1,    double w2, double b) {
    return w1 * study + w2 * sleep + b;
}


void train(vector<Example>& data, int epochs, double lr) {

    // Step 1 — start with random small weights
    double w1 = 10.0, w2 = 5.0, b = 6.0;

    for (int epoch = 1; epoch <= epochs; epoch++) {


        for (auto& e : data) {
            double predicted = predict(e.study, e.sleep, w1, w2, b);
            double error = e.marks - predicted;          
            w1 = w1 + lr * e.study * error;
            w2 = w2 + lr * e.sleep * error;
            b  = b  + lr * 1       * error; 

        }

        // Print progress every 100 epochs
        if (epoch % 100 == 0) {
            cout << "Epoch " << epoch
                 << "  |  w1=" << w1
                 << "  w2="    << w2
                 << "  b="     << b
                 << endl;
        }
    }

    // Final learned weights
    cout << "\n==============================\n";
    cout << "Training Complete!\n";
    cout << "Learned  →  w1=" << w1
         << "  w2=" << w2
         << "  b="  << b  << endl;
    cout << "Expected →  w1=5  w2=3  b=4\n";
}


int main() {
    vector<Example> data = loadDataset("dataset.csv");

    cout << "Dataset loaded: " << data.size() << " examples\n";

    int    epochs = 1000;
    double lr     = 0.0001;  

    train(data, epochs, lr);

    return 0;
}
