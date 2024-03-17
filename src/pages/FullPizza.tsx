import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

export const FullPizza = () => {
  const [pizza, setPizza] = useState<{
    imageUrl: string;
    title: string;
    price: number;
  }>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get('https://646a233d183682d6144ea085.mockapi.io/items/' + id);
        setPizza(data);
      } catch (error) {
        alert('Произошла ошибка получения данных. Нет такой пиццы');
        navigate('/');
      }
    }

    fetchPizza();
  }, []);
  if (!pizza) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <div className="container">
      <img src={pizza.imageUrl} alt={pizza.title} />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} ₽</h4>
    </div>
  );
};
