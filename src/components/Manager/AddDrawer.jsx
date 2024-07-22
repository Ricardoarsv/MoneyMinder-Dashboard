import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import PropTypes from 'prop-types';

export default function AddDrawer({ onAdd, open, onClose, selectTypes, selectCategories }) {
  // Add prop validation
  AddDrawer.propTypes = {
    onAdd: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    selectTypes: PropTypes.array.isRequired,
    selectCategories: PropTypes.array.isRequired,
  };

  const [type, setType] = useState(selectTypes.length > 0 ? selectTypes[0].name : '');
  const [category, setCategory] = useState(selectCategories.length > 0 ? selectCategories[0].name : '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [showErrormsg, setShowErrorMsg] = useState(false)

  useEffect(() => {
    if (selectTypes.length > 0) {
      setType(selectTypes[0].name);
    }
    if (selectCategories.length > 0) {
      setCategory(selectCategories[0].name);
    }
  }, [selectTypes, selectCategories]);

  const handleSubmit = () => {
    const dateNow = new Date().toISOString().slice(0, 10);
    
    // Convertir la cantidad a un número entero usando parseInt()
    const amountInt = parseInt(amount);

    // Validar si amountInt es un número entero
    if (!Number.isInteger(amountInt)) {
        setShowErrorMsg(true);
    } else {
        const newConcept = {
        id: Date.now(),
        type: type,
        Category: category,
        Title: title,
        Description: description,
        Date: dateNow,
        Amount: amountInt, // Usar la cantidad convertida a entero
        };

        onAdd(newConcept);
        setType(selectTypes.length > 0 ? selectTypes[0].name : '');
        setCategory(selectCategories.length > 0 ? selectCategories[0].name : '');
        setTitle('');
        setDescription('');
        setAmount('');
        onClose(); 
    }
    };

  return (
    <Drawer open={open}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add New Concept</DrawerTitle>
            <DrawerDescription>Fill in the details to add a new concept.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="mt-3 space-y-4">
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                id='Type'
                onChange={(e) => setType(e.target.value)}
                value={type}
              > 
                {selectTypes.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                id='Category'
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              > 
                {selectCategories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {showErrormsg && (
                <p className="text-red-400 text-xs p-0">Solo debe contener numeros.</p>
              )}
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
