# transactions

### A CSV Banking Transaction Application

## To Test:

- clone repo from github: `git clone https://github.com/jmrigali/transactions.git`
- run `npm install`
- update file in `assets/transactions.csv` with transaction data
- run command `node transactions.js transactions.csv > accounts.csv`
- validate output in `accounts.csv` file

### Considerations

- Adding an express server and a database to handle transactions
- adding more validation to make sure inputs are what we expect
- clean up code in `transactions.js` and separate out logic into helper files and logical modules
