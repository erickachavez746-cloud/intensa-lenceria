import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const C = {
  cream: '#F3EBE0',
  creamAlt: '#FBF7F1',
  brownDark: '#4A2E1A',
  brownMid: '#7A4B2A',
  rose: '#D98BA0',
  roseDeep: '#A73E5C',
  gold: '#A9824C',
  ink: '#2B2118',
  line: '#DDCBB4',
  white: '#FFFFFF',
  danger: '#B4423C',
  okBg: '#E7EFE2',
  okText: '#4C6B3C',
  pendBg: '#F6E9D2',
  pendText: '#8A5A20',
};

export default function DashboardTab({ totalRevenue, pendingCount, topProducts, catPie, pieColors }) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl p-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
          <p className="text-xs opacity-60 mb-1">Ingresos confirmados</p>
          <p className="text-2xl font-bold" style={{ color: C.roseDeep, fontFamily: "'Playfair Display', serif" }}>Bs {totalRevenue.toFixed(0)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
          <p className="text-xs opacity-60 mb-1">Pedidos pendientes</p>
          <p className="text-2xl font-bold" style={{ color: C.pendText, fontFamily: "'Playfair Display', serif" }}>{pendingCount}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-6" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
        <p className="text-sm font-semibold mb-3" style={{ color: C.brownDark }}>Productos más vendidos</p>
        {topProducts.length === 0 ? (
          <p className="text-xs opacity-60">Aún no hay ventas confirmadas.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
              <Tooltip />
              <Bar dataKey="qty" fill={C.roseDeep} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-xl p-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
        <p className="text-sm font-semibold mb-3" style={{ color: C.brownDark }}>Ingresos por categoría</p>
        {catPie.length === 0 ? (
          <p className="text-xs opacity-60">Aún no hay ventas confirmadas.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={catPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 10 }}>
                {catPie.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
