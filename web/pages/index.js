import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const HomePage = ({ menuData }) => {
  return (
    <Layout>
      <div>
        <h1>Weekly Menu</h1>
        {menuData && menuData.length > 0 ? (
          <ul>
            {menuData.map((item, index) => (
              <li key={index}>
                <strong>{item.day_of_week}</strong> ({item.week_start_date} - {item.week_end_date}): {item.dish_name} - {item.dish_description} {item.allergen_name && `(Allergens: ${item.allergen_name})`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No menu data available.</p>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/menu`);
  const menuData = await res.json();

  return {
    props: {
      menuData,
          <li><Link href="/register">Register</Link></li>
        </ul>
      </nav>
    </Layout>
  );
};

export default HomePage;