# Capcut Account Creator

This project automates the creation of Capcut accounts using random email addresses and a predefined password. It fetches random email domains, generates random usernames, and registers accounts on Capcut.

## Prerequisites

- Node.js (version 20 or higher)
- npm or pnpm

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/wahdalo/capcut-auto-regist.git
    cd capcut
    ```

2. Install the dependencies:
    ```sh
    pnpm install
    ```

## Configuration

1. Update the [config.json](http://_vscodecontentref_/0) file with the desired password:
    ```json
    {
      "password": "YourPasswordHere"
    }
    ```

## Usage

1. Run the script:
    ```sh
    node index.js <number_of_iterations>
    ```

    Replace `<number_of_iterations>` with the number of accounts you want to create. If not specified, it defaults to 1.

## License

This project is licensed under the ISC License.