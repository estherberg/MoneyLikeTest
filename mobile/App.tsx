import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

export default function App(){
  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'600' }}>MoneyLike – Mobile</Text>
      <View style={{ marginTop:12 }}>
        <Text>Écrans Wallet & Feed à implémenter par le candidat.</Text>
      </View>
    </SafeAreaView>
  );
}