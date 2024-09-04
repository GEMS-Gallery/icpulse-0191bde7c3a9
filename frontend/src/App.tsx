import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type OrderbookEntry = [number, number];
type Orderbook = {
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
};

const App: React.FC = () => {
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderbook = async () => {
      try {
        const result = await backend.getOrderbook();
        setOrderbook(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orderbook:', error);
        setLoading(false);
      }
    };

    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: orderbook ? [...orderbook.bids.map(b => b[0]), ...orderbook.asks.map(a => a[0])] : [],
    datasets: [
      {
        label: 'Bids',
        data: orderbook ? orderbook.bids.map(b => ({ x: b[0], y: b[1] })) : [],
        borderColor: '#43A047',
        backgroundColor: 'rgba(67, 160, 71, 0.5)',
      },
      {
        label: 'Asks',
        data: orderbook ? orderbook.asks.map(a => ({ x: a[0], y: a[1] })) : [],
        borderColor: '#E53935',
        backgroundColor: 'rgba(229, 57, 53, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ICP/USDT Orderbook',
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Price',
        },
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Quantity',
        },
      },
    },
  };

  return (
    <Container maxWidth="lg" className="mt-8">
      <Paper className="p-4 bg-opacity-80 backdrop-filter backdrop-blur-lg">
        <Typography variant="h4" component="h1" gutterBottom>
          ICP/USDT Exchange
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Orderbook
              </Typography>
              <div className="overflow-auto h-64">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Price</th>
                      <th className="text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderbook?.asks.slice().reverse().map(([price, quantity], index) => (
                      <tr key={`ask-${index}`} className="text-red-500">
                        <td>{price.toFixed(4)}</td>
                        <td className="text-right">{quantity.toFixed(4)}</td>
                      </tr>
                    ))}
                    {orderbook?.bids.map(([price, quantity], index) => (
                      <tr key={`bid-${index}`} className="text-green-500">
                        <td>{price.toFixed(4)}</td>
                        <td className="text-right">{quantity.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Price Chart
              </Typography>
              <Line options={chartOptions} data={chartData} />
            </Grid>
          </Grid>
        )}
      </Paper>
      <Typography variant="body2" className="mt-4 text-center text-gray-300">
        Background image by{' '}
        <a href="https://unsplash.com/photos/a-gold-coin-sitting-on-top-of-a-pile-of-gold-foil-MnWFs31CPEk" className="text-blue-300 hover:text-blue-100">
          Unsplash
        </a>
      </Typography>
    </Container>
  );
};

export default App;
