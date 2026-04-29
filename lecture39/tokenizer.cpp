// =====================================================================
//  Byte Pair Encoding (BPE) Tokenizer
//  Simple version — no custom structs, no operator overloading.
//
//  Compile:  g++ -std=c++17 bpe_tokenizer.cpp -o bpe
//  Run:      ./bpe
// =====================================================================

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <map>
#include <set>
#include <sstream>
#include <algorithm>

using namespace std;

// We represent a pair as a single string with "|" as separator.
// Example: pair ("l", "o") becomes the string "l|o"
// This way we can use a normal unordered_map<string, int> for counting.

string make_pair_key(const string& a, const string& b) {
    return a + "|" + b;
}


class BPETokenizer {
public:
    // token string  ->  token ID
    unordered_map<string, int> vocab;

    // token ID  ->  token string  (for decoding)
    unordered_map<int, string> id_to_token;

    // List of merges in the order they were learned.
    // Each merge is stored as two strings: (first, second)
    vector<string> merge_first;
    vector<string> merge_second;


    // -----------------------------------------------------------------
    //  TRAIN — learn the vocabulary from text
    // -----------------------------------------------------------------
    void train(const string& text, int num_merges) {
        cout << "=== TRAINING BPE TOKENIZER ===\n";
        cout << "Text length: " << text.size() << " characters\n";
        cout << "Target merges: " << num_merges << "\n\n";

        // -------------------------------------------------------------
        // STEP 1: Split text into words.
        // Each word becomes a list of single characters.
        // We add "</w>" at the end of each word as an end-of-word marker.
        //
        // Example:  "low" -> ["l", "o", "w", "</w>"]
        //
        // We count how many times each word appears, so we don't
        // process duplicates over and over.
        // -------------------------------------------------------------
        map<vector<string>, int> word_freq;

        stringstream ss(text);
        string word;
        while (ss >> word) {
            vector<string> tokens;
            for (char c : word) {
                tokens.push_back(string(1, c));
            }
            tokens.push_back("</w>");
            word_freq[tokens]++;
        }

        cout << "Unique words: " << word_freq.size() << "\n\n";


        // -------------------------------------------------------------
        // STEP 2: Build initial vocabulary from all unique characters
        // -------------------------------------------------------------
        set<string> initial_chars;
        for (auto& entry : word_freq) {
            for (auto& tok : entry.first) {
                initial_chars.insert(tok);
            }
        }

        int next_id = 0;
        for (int b = 0; b < 256; b++) {
            string ch(1, (char)b);   // string of length 1 containing byte b
            vocab[ch] = next_id;
            id_to_token[next_id] = ch;
            next_id++;
        }

        // Also add the end-of-word marker
        vocab["</w>"] = next_id;
        id_to_token[next_id] = "</w>";
        next_id++;


        // -------------------------------------------------------------
        // STEP 3: Do `num_merges` rounds of merging
        // -------------------------------------------------------------
        for (int iter = 0; iter < num_merges; iter++) {

            // 3a. Count every adjacent pair across all words
            unordered_map<string, int> pair_counts;

            for (auto& entry : word_freq) {
                const vector<string>& tokens = entry.first;
                int freq = entry.second;

                for (size_t i = 0; i + 1 < tokens.size(); i++) {
                    string key = make_pair_key(tokens[i], tokens[i + 1]);
                    pair_counts[key] += freq;
                }
            }

            if (pair_counts.empty()) {
                cout << "No more pairs to merge. Stopping.\n";
                break;
            }

            // 3b. Find the most frequent pair
            string best_first;
            string best_second;
            int best_count = 0;

            for (auto& entry : pair_counts) {
                if (entry.second > best_count) {
                    best_count = entry.second;
                    // Split "a|b" back into ("a", "b")
                    string key = entry.first;
                    size_t sep = key.find("|");
                    best_first  = key.substr(0, sep);
                    best_second = key.substr(sep + 1);
                }
            }

            if (best_count < 2) {
                cout << "Best pair only appears once. Stopping.\n";
                break;
            }

            // 3c. Add the merged token to the vocabulary
            string merged = best_first + best_second;
            vocab[merged] = next_id;
            id_to_token[next_id] = merged;
            next_id++;

            merge_first.push_back(best_first);
            merge_second.push_back(best_second);

            cout << "Merge " << (iter + 1) << ": ('"
                 << best_first << "', '" << best_second
                 << "') -> '" << merged
                 << "'  (frequency: " << best_count << ")\n";

            // 3d. Apply the merge to every word.
            // Replace every adjacent (best_first, best_second)
            // with the merged token.
            map<vector<string>, int> new_word_freq;

            for (auto& entry : word_freq) {
                const vector<string>& tokens = entry.first;
                int freq = entry.second;

                vector<string> new_tokens;
                size_t i = 0;
                while (i < tokens.size()) {
                    if (i + 1 < tokens.size()
                        && tokens[i]     == best_first
                        && tokens[i + 1] == best_second) {
                        new_tokens.push_back(merged);
                        i += 2;
                    } else {
                        new_tokens.push_back(tokens[i]);
                        i += 1;
                    }
                }

                new_word_freq[new_tokens] += freq;
            }

            word_freq = new_word_freq;
        }

        cout << "\n=== TRAINING COMPLETE ===\n";
        cout << "Final vocab size: " << vocab.size() << " tokens\n";
        cout << "Total merges learned: " << merge_first.size() << "\n\n";
    }


    // -----------------------------------------------------------------
    //  ENCODE — convert input text into token IDs
    // -----------------------------------------------------------------
    vector<int> encode(const string& text) {
        vector<int> result;

        stringstream ss(text);
        string word;

        while (ss >> word) {
            // Start at character level
            vector<string> tokens;
            for (char c : word) {
                tokens.push_back(string(1, c));
            }
            tokens.push_back("</w>");

            // Apply each merge in the same order it was learned
            for (size_t m = 0; m < merge_first.size(); m++) {
                string first  = merge_first[m];
                string second = merge_second[m];

                vector<string> new_tokens;
                size_t i = 0;
                while (i < tokens.size()) {
                    if (i + 1 < tokens.size()
                        && tokens[i]     == first
                        && tokens[i + 1] == second) {
                        new_tokens.push_back(first + second);
                        i += 2;
                    } else {
                        new_tokens.push_back(tokens[i]);
                        i += 1;
                    }
                }
                tokens = new_tokens;
            }

            // Convert tokens to IDs
            for (auto& t : tokens) {
                if (vocab.count(t)) {
                    result.push_back(vocab[t]);
                } else {
                    cerr << "Warning: unknown token '" << t << "'\n";
                }
            }
        }

        return result;
    }


    // -----------------------------------------------------------------
    //  DECODE — convert token IDs back to text
    // -----------------------------------------------------------------
    string decode(const vector<int>& ids) {
        string result;
        for (int id : ids) {
            if (id_to_token.count(id) == 0) continue;

            string tok = id_to_token[id];

            // Replace </w> with a space (end of word)
            size_t pos = tok.find("</w>");
            if (pos != string::npos) {
                result += tok.substr(0, pos) + " ";
            } else {
                result += tok;
            }
        }
        return result;
    }


    // -----------------------------------------------------------------
    //  Print the vocabulary (sorted by ID)
    // -----------------------------------------------------------------
    void print_vocab() {
        cout << "=== VOCABULARY ===\n";
        vector<pair<int, string>> sorted_vocab;
        for (auto& entry : vocab) {
            sorted_vocab.push_back({entry.second, entry.first});
        }
        sort(sorted_vocab.begin(), sorted_vocab.end());
        for (auto& entry : sorted_vocab) {
            cout << "  ID " << entry.first << " -> '" << entry.second << "'\n";
        }
        cout << "\n";
    }
};


// ---------------------------------------------------------------------
//  MAIN — quick demo
// ---------------------------------------------------------------------
int main() {
    string training_text =
        "low low low low low lower lower newest newest newest";

    BPETokenizer tokenizer;
    tokenizer.train(training_text, 5);
    tokenizer.print_vocab();

    // ---- Encoding test ----
    cout << "=== ENCODING TEST ===\n";
    string test_text = "low lower newest";
    cout << "Input: \"" << test_text << "\"\n";

    vector<int> ids = tokenizer.encode(test_text);

    cout << "Token IDs: ";
    for (int id : ids) cout << id << " ";
    cout << "\n";

    cout << "Tokens:    ";
    for (int id : ids) cout << "'" << tokenizer.id_to_token[id] << "' ";
    cout << "\n";

    // ---- Decoding test ----
    cout << "\n=== DECODING TEST ===\n";
    cout << "Decoded: \"" << tokenizer.decode(ids) << "\"\n";

    // ---- Unknown word test ----
    cout << "\n=== UNKNOWN WORD TEST ===\n";
    string unknown_text = "lowest";
    cout << "Input: \"" << unknown_text << "\"\n";
    vector<int> unknown_ids = tokenizer.encode(unknown_text);
    cout << "Tokens: ";
    for (int id : unknown_ids) cout << "'" << tokenizer.id_to_token[id] << "' ";
    cout << "\n";
    cout << "(notice: 'low' is reused as a single token; rest fall back to chars)\n";

    return 0;
}