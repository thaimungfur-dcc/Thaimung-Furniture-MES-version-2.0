import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface CatalogueDashboardProps {
  products: any[];
}

const CatalogueDashboard: React.FC<CatalogueDashboardProps> = ({ products }) => {
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const priceChartRef = useRef<HTMLCanvasElement>(null);
  const ratingChartRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<{ category: any; price: any; rating: any }>({ category: null, price: null, rating: null });

  useEffect(() => {
    // Cleanup existing charts
    Object.values(charts.current).forEach((c: any) => c && c.destroy());

    Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";

    // 1. Category Chart
    const catData: Record<string, number> = {};
    products.forEach(p => {
      if (p.category) catData[p.category] = (catData[p.category] || 0) + 1;
    });

    if (categoryChartRef.current) {
      charts.current.category = new Chart(categoryChartRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(catData),
          datasets: [{
            data: Object.values(catData),
            backgroundColor: ['#111f42', '#ab8a3b', '#72A09E', '#E3624A', '#10b981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }

    // 2. Price Distribution Chart
    const priceBuckets: Record<string, number> = { '< 5,000': 0, '5,001 - 15,000': 0, '15,001 - 30,000': 0, '> 30,000': 0 };
    products.forEach(p => {
      const price = Number(p.price.toString().replace(/,/g, ''));
      if (price < 5000) priceBuckets['< 5,000']++;
      else if (price <= 15000) priceBuckets['5,001 - 15,000']++;
      else if (price <= 30000) priceBuckets['15,001 - 30,000']++;
      else priceBuckets['> 30,000']++;
    });

    if (priceChartRef.current) {
      charts.current.price = new Chart(priceChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(priceBuckets),
          datasets: [{
            label: 'Number of Items',
            data: Object.values(priceBuckets),
            backgroundColor: '#111f42',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // 3. Rating Chart
    const ratingData: Record<string, number> = { '5 Stars': 0, '4 Stars': 0, '3 Stars': 0, '1-2 Stars': 0 };
    products.forEach(p => {
      if (p.rating === 5) ratingData['5 Stars']++;
      else if (p.rating === 4) ratingData['4 Stars']++;
      else if (p.rating === 3) ratingData['3 Stars']++;
      else ratingData['1-2 Stars']++;
    });

    if (ratingChartRef.current) {
      charts.current.rating = new Chart(ratingChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(ratingData),
          datasets: [{
            label: 'Number of Items',
            data: Object.values(ratingData),
            backgroundColor: '#ab8a3b',
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    return () => {
      Object.values(charts.current).forEach((c: any) => c && c.destroy());
    };
  }, [products]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col lg:col-span-1">
        <h3 className="text-xs font-black text-[#111f42] uppercase mb-4 tracking-widest flex items-center gap-2">Items by Category</h3>
        <div className="flex-1 relative min-h-0">
          <canvas ref={categoryChartRef}></canvas>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col lg:col-span-2">
        <h3 className="text-xs font-black text-[#111f42] uppercase mb-4 tracking-widest flex items-center gap-2">Price Range Distribution</h3>
        <div className="flex-1 relative min-h-0">
          <canvas ref={priceChartRef}></canvas>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col lg:col-span-3">
        <h3 className="text-xs font-black text-[#111f42] uppercase mb-4 tracking-widest flex items-center gap-2">Product Ratings Overview</h3>
        <div className="flex-1 relative min-h-0">
          <canvas ref={ratingChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default CatalogueDashboard;
