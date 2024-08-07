"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { collection, deleteDoc, getDocs, query, setDoc, doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList); // Update the state with the fetched inventory
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    updateInventory(); // Update inventory after adding item
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      updateInventory(); // Update inventory after removing item
    }
  };

  useEffect(() => {
    updateInventory(); // Call the function when the component mounts
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      flexDirection="column" 
      gap={2} 
      bgcolor="white" 
      sx={{ color: 'black' }} 
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          transform="translate(-50%,-50%)" 
          width={400} 
          bgcolor="white" 
          border="2px solid #000" 
          boxShadow={24} 
          p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3}
          sx={{ color: 'black' }} 
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="outlined" onClick={() => { addItem(itemName); setItemName(''); handleClose(); }}>ADD</Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained" 
        onClick={handleOpen} 
        sx={{ backgroundColor: 'blue', color: 'white', marginBottom: '20px' }}
      >
        ADD NEW ITEM
      </Button>
      <Box width="80%" mt={4}>
        <Typography 
          variant="h5" 
          sx={{ color: 'black', backgroundColor: '#a2c4c9', padding: '10px', textAlign: 'center' }}
        >
          Inventory Items
        </Typography>
        {inventory.map((item, index) => (
          <Box 
            key={index} 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mt={2} 
            p={2} 
            border="1px solid #ccc" 
            borderRadius="4px" 
            sx={{ color: 'black' }}
          >
            <Typography>{item.name}: {item.quantity}</Typography>
            <Button variant="contained" color="secondary" onClick={() => removeItem(item.name)}>REMOVE</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
