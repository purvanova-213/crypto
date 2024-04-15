import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState(0);
  const [canBuy, setCanBuy] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [topCryptocurrencies, setTopCryptocurrencies] = useState([]);

  useEffect(() => {
    // Fetch user data
    setUser({
      name: "Purva Masurkar",
      email: "purvamasurkar12@gmail.com"
    });

    // Mocked bank account data
    setBankAccounts([
      { id: 1, name: "USA (USD)", currency: "USD", balance: 5000 },
      { id: 2, name: "Indian (INR)", currency: "INR", balance: 2500 },
      { id: 3, name: "Eurozone (EUR)", currency: "EUR", balance: 3000 }
    ]);

    // Fetch real-time cryptocurrency prices
    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,ripple,cardano,polkadot&vs_currencies=usd');
        const prices = Object.keys(response.data).map((currency, index) => ({
          id: index + 1,
          currency: currency.charAt(0).toUpperCase() + currency.slice(1),
          price: response.data[currency].usd
        }));
        setCryptoPrices(prices);
      } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error);
      }
    };

    // Fetch real-time market trends
    const fetchMarketTrends = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/global');
        setMarketTrends(response.data.data);
      } catch (error) {
        console.error('Error fetching market trends:', error);
      }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Fetch real-time top-performing cryptocurrencies
    const fetchTopCryptocurrencies = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
        setTopCryptocurrencies(response.data);
      } catch (error) {
        console.error('Error fetching top cryptocurrencies:', error);
        // Set top cryptocurrencies to an empty array in case of error
        await delay(5000);
        setTopCryptocurrencies([]);
      }
    };

    fetchCryptoPrices();
    fetchMarketTrends();
    fetchTopCryptocurrencies();
  }, []);

  useEffect(() => {
    // Check if the user can buy the selected cryptocurrency
    if (selectedCrypto && amount > 0 && selectedAccount) {
      const account = bankAccounts.find(account => account.name.toLowerCase() === selectedAccount.toLowerCase());
      const crypto = cryptoPrices.find(price => price.currency.toLowerCase() === selectedCrypto.toLowerCase());
      if (crypto && account && account.balance >= amount * crypto.price) {
        setCanBuy(true);
      } else {
        setCanBuy(false);
      }
    } else {
      setCanBuy(false);
    }
  }, [selectedCrypto, amount, selectedAccount, bankAccounts, cryptoPrices]);

  const handleBuy = () => {
    // Implement buy functionality
    // Update transaction history
    const transaction = { 
      id: transactionHistory.length + 1,
      crypto: selectedCrypto,
      amount: amount,
      price: cryptoPrices.find(price => price.currency.toLowerCase() === selectedCrypto.toLowerCase()).price,
      date: new Date().toLocaleString()
    };
    setTransactionHistory([...transactionHistory, transaction]);
    // Deduct the amount from the bank account balance
    const updatedBankAccounts = bankAccounts.map(account => {
      if (account.name.toLowerCase() === selectedAccount.toLowerCase()) {
        return { ...account, balance: account.balance - amount * transaction.price };
      }
      return account;
    });
    setBankAccounts(updatedBankAccounts);
    // Reset input fields
    setSelectedCrypto('');
    setAmount(0);
    setCanBuy(false);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
      </div>
      <div className="dashboard-content">
        <div className="account-balance">
          <h3>Account Balances</h3>
          <ul>
            {bankAccounts.map(account => (
              <li key={account.id}>
                {account.name}: ${account.balance}
              </li>
            ))}
          </ul>
        </div>
        <div className="market-trends">
          <h3>Market Trends</h3>
          <p>Market Cap: {marketTrends.market_cap && `$${marketTrends.market_cap.usd.toLocaleString()}`}</p>
          <p>24h Total Volume: {marketTrends.total_volume && `$${marketTrends.total_volume.usd.toLocaleString()}`}</p>
          {/* You can display more market trends data here */}
        </div>
        <div className="top-cryptocurrencies">
          <h3>Top-performing Cryptocurrencies</h3>
          <ul>
            {topCryptocurrencies.map(crypto => (
              <li key={crypto.id}>
                {crypto.name}: ${crypto.current_price}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="trading-panel">
        <h3>Trading Panel</h3>
        <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
          <option value="">Select an account</option>
          {bankAccounts.map(account => (
            <option key={account.id} value={account.name.toLowerCase()}>{account.name}</option>
          ))}
        </select>
        <select value={selectedCrypto} onChange={e => setSelectedCrypto(e.target.value)}>
          <option value="">Select a cryptocurrency</option>
          {cryptoPrices.map(crypto => (
            <option key={crypto.id} value={crypto.currency.toLowerCase()}>{crypto.currency}</option>
          ))}
        </select>
        <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} placeholder="Enter amount" />
        <button onClick={handleBuy} disabled={!canBuy}>Buy</button>
      </div>
      <div className="transaction-history">
        <h3>Transaction History</h3>
        <ul>
          {transactionHistory.map(transaction => (
            <li key={transaction.id}>
              {transaction.date}: Bought {transaction.amount} {transaction.crypto} at ${transaction.price} each.
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
