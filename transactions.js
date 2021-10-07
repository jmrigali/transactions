// const TestCSV = require('./assets/test.csv')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const fs = require('fs')
const Client = require('./Client')
const results = []

async function main(arguments) {
  
  const files = arguments.split('>')
  // Using npm package csv-parser to read csv file
  fs.createReadStream(`./assets/${files[0]}`)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
     
      const users = {}
      results.forEach((transaction) => {
        if (!users[transaction.client]) {
          users[transaction.client] = new Client()
        }
        const client = users[transaction.client]

        switch (transaction.type) {
          case 'deposit':
            client.handleDeposit(transaction)

            break
          case 'withdrawal':
            client.handleWithdrawal(transaction)

            break
          case 'dispute':
            client.handleDispute(transaction)
            break
          case 'resolve':
            client.handleResolution(transaction)
            break
          case 'chargeback':
            client.handleChargebacks(transaction)
            break
          default:
            break
        }
      })
      const data = []
      for (let user in users) {
        const currentUser = users[user]
        data.push({
          client: user,
          available: toPrecision(currentUser.available),
          held: toPrecision(currentUser.held),
          total: toPrecision(currentUser.available + currentUser.held),
          locked: currentUser.locked
        })
      }
      console.log(files)
      createFinalCSV(data, files[1])
    })
}

function toPrecision(amount) {
  return parseFloat(amount.toFixed(4))
}

//using npm package to write data to a csv file
function createFinalCSV(data, file) {
  console.log(process.argv[2])
  const outputFile = file ? file : 'accounts.csv'
  const csvWriter = createCsvWriter({
    path: `./results/${outputFile}`,
    header: [
      { id: 'client', title: 'Client' },
      { id: 'available', title: 'Available' },
      { id: 'held', title: 'Held' },
      { id: 'total', title: 'Total' },
      { id: 'locked', title: 'Locked' }
    ]
  })

  csvWriter.writeRecords(data).then(() => console.log('The CSV file was written successfully')).catch(err => console.log(err))
}

main(process.argv[2])
