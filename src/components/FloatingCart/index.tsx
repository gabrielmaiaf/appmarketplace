import React, { useState, useEffect, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const [values, setValues] = useState({
    price: 0,
    itens: 0,
  });

  useEffect(() => {
    let price = 0;
    let itens = 0;

    products.forEach(product => {
      price += product.price * product.quantity;
      itens += product.quantity;
    });

    setValues({
      price,
      itens,
    });
  }, [products]);

  const cartTotal = useMemo(() => {
    return formatValue(values.price);
  }, [values.price]);

  const totalItensInCart = useMemo(() => {
    return values.itens;
  }, [values.itens]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
