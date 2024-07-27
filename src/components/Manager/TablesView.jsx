import { useEffect, useState, useCallback } from 'react';
import apiURL from '../../utils/fetchRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faTrash, faPenToSquare, faSquarePlus, faCircleCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import PropTypes from "prop-types";
import AddDrawer from './AddDrawer';
import { useAuth } from '../../App'; 

export default function TablesView({ localUser }) {
  const [state, setState] = useState({
    editing: false,
    selectToEdit: [],
    deleting: false,
    selectToDelete: '',
    adding: false,
    totalAmount: 0,
    selectTypes: [],
    selectedType: '',
    availableCategories: [],
    selectCategories: [],
    data: [],
  });
  const { token, setToken } = useAuth();
  const fetchData = useCallback(async () => {
    try {
      const [categoriesResponse, typesResponse, itemsResponse] = await Promise.all([
        fetch(`${apiURL}/categories/get_categories/${localUser}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            }),
        fetch(`${apiURL}/types/get_types/${localUser}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            }),
        fetch(`${apiURL}/items/get_items/${localUser}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            }),
      ]);

      if (!categoriesResponse.ok || !typesResponse.ok || !itemsResponse.ok) {
        throw new Error('HTTP error!');
      }

      const [categoriesData, typesData, itemsData] = await Promise.all([
        categoriesResponse.json(),
        typesResponse.json(),
        itemsResponse.json(),
      ]);

      setState(prevState => ({
        ...prevState,
        selectCategories: categoriesData,
        selectTypes: typesData,
        data: itemsData,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [localUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (state.selectCategories.length > 0 && state.selectTypes.length > 0) {
      formatValues(state.data);
    }
  }, [state.selectCategories, state.selectTypes]);

    useEffect(() => {
    const filteredCategories = state.selectCategories.filter(
        category => category.category_type === parseInt(state.selectedType)
    );
    setState(prevState => ({
        ...prevState,
        availableCategories: filteredCategories,
    }));
    }, [state.selectedType, state.selectCategories]);

  const formatValues = useCallback((dataToFormat) => {
    let total = 0;
    const formatData = dataToFormat.map((invoice) => {
      const category = state.selectCategories.find((category) => parseInt(invoice.category) === category.id);
      const type = state.selectTypes.find((type) => category && category.category_type === type.id);

      if (category && type) {
        const amountForTotal = parseFloat(invoice.cost.toString().replace(/[$-]/g, ''));
        invoice["typeId"] = type.id;
        invoice["typeName"] = type.typeName;
        invoice["categoryName"] = category.title;
        if (type.is_negative) {
          total -= amountForTotal;
          invoice.cost = parseInt(`-${amountForTotal}`);
        } else {
          total += amountForTotal;
          invoice.cost = parseInt(`${amountForTotal}`);
        }
      }
      return invoice;
    });
    setState(prevState => ({
      ...prevState,
      totalAmount: total,
      data: formatData,
    }));
  }, [state.selectCategories, state.selectTypes]);

  const handleEdit = useCallback((newData) => {
    const dataCopy = [...state.data];
    const index = dataCopy.findIndex((invoice) => invoice.id === parseInt(state.selectToEdit.id));
    dataCopy[index] = newData;
    console.log({
        "id": newData.id,
        "title": newData.title.toString(),
        "description": newData.description.toString(),
        "category": parseInt(newData.category),
        "cost": parseInt(newData.cost.toString().replace(/[$-]/g, '')),
    })

    fetch(`${apiURL}/items/update_item/${newData.id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          },
      body: JSON.stringify({
        "title": newData.title.toString(),
        "description": newData.description.toString(),
        "category": parseInt(newData.category),
        "cost": parseInt(newData.cost.toString().replace(/[$-]/g, '')),
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        formatValues(dataCopy)
        setState(prevState => ({
        ...prevState,
        selectToEdit: [],
        selectedType: '',
        availableCategories: [],
        }));
      })
      .catch(error => console.error('Error updating item:', error));
    
  }, [state.data, state.selectToEdit, formatValues]);

  const handleDelete = useCallback((id) => {
    fetch(`${apiURL}/items/delete_item/${id}`,
      {
          method: 'DELETE',
          headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const dataCopy = [...state.data];
        const index = dataCopy.findIndex((invoice) => invoice.id === id);
        dataCopy.splice(index, 1);
        formatValues(dataCopy);
        setState(prevState => ({
          ...prevState,
          selectToDelete: '',
        }));
      })
      .catch(error => console.error('Error deleting item:', error));
  }, [state.data, formatValues]);

  const handleAdd = useCallback((newData) => {
    console.log(newData)
    fetch("http://localhost:8000/items/create_item",
      {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
      body: JSON.stringify({
        "title": newData.Title.toString(),
        "description": newData.Description.toString(),
        "category": parseInt(newData.Category),
        "cost": parseInt(newData.Amount.toString().replace(/[$-]/g, '')),
        "createDate": newData.Date,
        "owner_id": parseInt(localUser),
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(responseData => {
        formatValues([...state.data, responseData]);
      })
      .catch(error => console.error('Error adding item:', error));
    setState(prevState => ({
      ...prevState,
      adding: false,
    }));
  }, [state.data, formatValues, localUser]);

  const { editing, deleting, adding, totalAmount, selectTypes, availableCategories, data, selectToEdit, selectedType, selectCategories } = state;

  return (
    <div className="mx-4 sm:mx-12 sm:ml-14 mt-4 p-2 max-h-fit w-full bg-gray-100 sm:bg-white border-accentPalette border-2 rounded-xl">
      <div className="flex flex-row items-center p-2 gap-4">
        <FontAwesomeIcon className="text-1xl text-textPalette" icon={faClockRotateLeft} />
        <h1 className="text-textPalette text-1xl font-bold">History</h1>
      </div>
      <hr className="w-full border-1 border-accentPalette" />
      {state.data.length == 0 ? (
        <div className="flex flex-col gap-4 py-3">
            <div className="flex flex-row min-h-10 justify-between">
            <h1 className="text-textPalette text-1xl font-bold">This Month</h1>
            <div className="flex flex-row items-center pr-10">
                <FontAwesomeIcon
                className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${adding ? "text-4xl text-hoverPalette pr-4" : "pr-6"}`}
                icon={faSquarePlus}
                onClick={() => {
                    setState(prevState => ({
                    ...prevState,
                    adding: !adding,
                    deleting: false,
                    editing: false,
                    selectToEdit: [],
                    selectedTypes: '',
                    }));
                }}
                />
                <FontAwesomeIcon
                className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${editing ? "text-4xl text-hoverPalette pr-4" : "pr-4"}`}
                icon={faPenToSquare}
                onClick={() => {
                    setState(prevState => ({
                    ...prevState,
                    editing: !editing,
                    deleting: false,
                    adding: false,
                    selectToEdit: [],
                    selectedTypes: '',
                    }));
                }}
                />
                <FontAwesomeIcon
                className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${deleting ? "text-4xl text-hoverPalette pl-0" : "pl-2"}`}
                icon={faTrash}
                onClick={() => {
                    setState(prevState => ({
                    ...prevState,
                    deleting: !deleting,
                    editing: false,
                    adding: false,
                    selectToEdit: [],
                    selectedTypes: '',
                    }));
                }}
                />
            </div>
            </div>
            <h1>No tienes registros</h1>
            
            <div className="flex flex-col md:flex-row justify-center flex-grow gap-4">
              <AddDrawer open={adding} onAdd={handleAdd} onClose={() => setState(prevState => ({ ...prevState, adding: false }))} selectTypes={selectTypes} selectCategories={selectCategories} />
            </div>
        </div>
      ):(
        <div className="flex flex-col gap-4 py-3">
        <div className="flex flex-row min-h-10 justify-between">
          <h1 className="text-textPalette text-1xl font-bold">This Month</h1>
          <div className="flex flex-row items-center pr-10">
            <FontAwesomeIcon
              className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${adding ? "text-4xl text-hoverPalette pr-4" : "pr-6"}`}
              icon={faSquarePlus}
              onClick={() => {
                setState(prevState => ({
                  ...prevState,
                  adding: !adding,
                  deleting: false,
                  editing: false,
                  selectToEdit: [],
                  selectedTypes: '',
                }));
              }}
            />
            <FontAwesomeIcon
              className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${editing ? "text-4xl text-hoverPalette pr-4" : "pr-4"}`}
              icon={faPenToSquare}
              onClick={() => {
                setState(prevState => ({
                  ...prevState,
                  editing: !editing,
                  deleting: false,
                  adding: false,
                  selectToEdit: [],
                  selectedTypes: '',
                }));
              }}
            />
            <FontAwesomeIcon
              className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${deleting ? "text-4xl text-hoverPalette pl-0" : "pl-2"}`}
              icon={faTrash}
              onClick={() => {
                setState(prevState => ({
                  ...prevState,
                  deleting: !deleting,
                  editing: false,
                  adding: false,
                  selectToEdit: [],
                  selectedTypes: '',
                }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center flex-grow gap-4">
            <AddDrawer open={adding} onAdd={handleAdd} onClose={() => setState(prevState => ({ ...prevState, adding: false }))} selectTypes={selectTypes} selectCategories={selectCategories} />
            <div className="overflow-x-auto w-full">
                <Table className="min-w-full divide-y divide-gray-200">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader className="text-[2vw] sm:text-[1vw]">
                    <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-[2vw] sm:text-[1vw]">
                    {data.map((invoice) => (
                        <TableRow
                            key={invoice.id}
                            className={`${editing ? "hover:bg-accent2Palette" : ""} ${deleting ? "hover:bg-red-300" : ""}`}
                            onClick={(e) => {
                                if (e.target.tagName !== 'SELECT') {
                                    if (editing) {
                                        setState(prevState => ({
                                            ...prevState,
                                            selectToEdit: invoice,
                                            selectedType: invoice.typeId,
                                        }));
                                        document.querySelector("#TriggerEdit").click();
                                    } else if (deleting) {
                                        setState(prevState => ({
                                            ...prevState,
                                            selectToDelete: invoice.id,
                                        }));
                                        document.querySelector("#TriggerDelete").click();
                                    }
                                }
                            }}
                        >
                            <TableCell className="font-medium">{invoice.typeName}</TableCell>
                            <TableCell>{invoice.categoryName}</TableCell>
                            <TableCell>{invoice.title}</TableCell>
                            <TableCell>{invoice.description}</TableCell>
                            <TableCell>{invoice.createDate}</TableCell>
                            <TableCell className="text-right">{invoice.cost.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                    <TableCell colSpan='5'>Total</TableCell>
                    <TableCell className="text-right">{totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                    </TableRow>
                </TableFooter>
                </Table>
            </div>


            {editing && (
                <Dialog>
                <DialogTrigger asChild>
                    <button id='TriggerEdit' className="hidden">Trigger</button>
                </DialogTrigger>
                <DialogContent className="w-[80%]" aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>Edit log</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor={`Type-${selectToEdit.id}`} className="text-left">
                                Type
                            </Label>
                            <select
                                id={`Type-${selectToEdit.id}`}
                                className="w-full"
                                defaultValue={selectToEdit.typeId}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    setState(prevState => ({
                                        ...prevState,
                                        selectedType: e.target.value,
                                    }));
                                }}
                            >
                                {selectTypes.map((type) => (
                                    <option disabled={!type.active} key={type.id} value={type.id}>
                                        {!type.active ? `${type.typeName} - Disabled` : type.typeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor={`Category-${selectToEdit.id}`} className="text-left">
                                Category
                            </Label>
                            <select
                                id={`Category-${selectToEdit.id}`}
                                className="w-full"
                                defaultValue={selectToEdit.categoryName}
                                onChange={(e) => {
                                    setState(prevState => ({
                                        ...prevState,
                                        data: prevState.data.map(item => 
                                            item.id === selectToEdit.id ? { ...item, categoryName: e.target.value } : item
                                        ),
                                    }));
                                }}
                            >
                                {availableCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {!category.active ? `${category.title} - Disabled` : category.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor={`Title-${selectToEdit.id}`} className="text-left">
                                Title
                            </Label>
                            <input 
                                id={`Title-${selectToEdit.id}`}
                                className="w-full"
                                placeholder={selectToEdit.title} 
                                defaultValue={selectToEdit.title}
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor={`Description-${selectToEdit.id}`} className="text-left">
                                Description
                            </Label>
                            <input 
                                id={`Description-${selectToEdit.id}`}
                                className="w-full"
                                placeholder={selectToEdit.description} 
                                defaultValue={selectToEdit.description} 
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor={`Date-${selectToEdit.id}`} className="text-left">
                                Date
                            </Label>
                            <p>{selectToEdit.createDate}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor={`Amount-${selectToEdit.id}`} className="text-left">
                                Amount
                            </Label>
                            <input 
                                id={`Amount-${selectToEdit.id}`} 
                                className="w-full"
                                placeholder={selectToEdit.cost} 
                                defaultValue={selectToEdit.cost} 
                            />
                        </div>
                    </div>
                    <DialogFooter className='flex flex-row justify-center gap-4'>
                        <div 
                            className='flex flex-row gap-2 items-center cursor-pointer text-green-500 hover:text-green-400'
                            onClick={() => {
                                const newEditData = {
                                    id: parseInt(selectToEdit.id),
                                    typeId: parseInt(document.getElementById(`Type-${selectToEdit.id}`).value),
                                    category: parseInt(document.getElementById(`Category-${selectToEdit.id}`).value),
                                    title: document.getElementById(`Title-${selectToEdit.id}`).value,
                                    description: document.getElementById(`Description-${selectToEdit.id}`).value,
                                    createDate: selectToEdit.createDate,
                                    cost: (document.getElementById(`Amount-${selectToEdit.id}`).value).replace(/[$-]/g, ''),
                                };
                                handleEdit(newEditData);
                                document.querySelector('#TriggerEdit').click()
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                className='text-2xl'
                            />
                            <h1 className='font-bold'>Submit</h1>
                        </div>
                        <div 
                            className='flex flex-row gap-2 items-center cursor-pointer text-red-500 hover:text-red-400'
                            onClick={() => {
                                    setState(prevState => ({
                                        ...prevState,
                                        selectToEdit: [],
                                    }));
                                    document.querySelector('#TriggerEdit').click()
                                }}
                        >
                            <FontAwesomeIcon
                                icon={faBan}
                                className='text-2xl'
                            />
                            <h1 className='font-bold'>Cancel</h1>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            )}

            {deleting && (
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button id='TriggerDelete' className="hidden">Trigger</button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this log.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setState(prevState => ({ ...prevState, deleting: false }))}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(state.selectToDelete)}>
                        Continue
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
      </div>
      )}
      
    </div>
  );
}

TablesView.propTypes = {
  localUser: PropTypes.string.isRequired,
};
