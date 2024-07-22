import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faTrash, faPenToSquare, faSquarePlus, faCircleCheck, faBan } from '@fortawesome/free-solid-svg-icons'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"

import AddDrawer from './AddDrawer'

export default function TablesView({ localUser }) {
    const [editing, setEditing] = useState(false)
    const [selectToEdit, setSelectToEdit] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [selectToDelete, setSelectToDelete] = useState('')
    const [adding, setAdding] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0)
    const [selectTypes, setSelectTypes] = useState([
        { id: 1, name: "Salary", "IS_NEGATIVE": false},
        { id: 3, name: "Investment", "IS_NEGATIVE": true },
        { id: 4, name: "Others", "IS_NEGATIVE": true },
    ])
    const [selectCategories, setSelectCategories] = useState([
        { id: 1, name: "Income" },
        { id: 2, name: "Expense" },
    ])
    const [data, setData] = useState([])

    useEffect(() => {
       const initialData = [
        {
            id: 1,
            type: "Investment",
            Category: "Income",
            Title: "Payment",
            Description: "Payment from company",
            Date: "2021-09-10",
            Amount: 250,
        },
        {
            id: 2,
            type: "Others",
            Category: "Income",
            Title: "Payment",
            Description: "Payment from company",
            Date: "2021-09-10",
            Amount: 250,
        },
        {
            id: 3,
            type: "Salary",
            Category: "Income",
            Title: "Payment",
            Description: "Payment from company",
            Date: "2021-09-10",
            Amount: 250,
        },
        {
            id: 4,
            type: "Salary",
            Category: "Income",
            Title: "Payment",
            Description: "Payment from company",
            Date: "2021-09-10",
            Amount: 250,
        },
        {
            id: 5,
            type: "Salary",
            Category: "Income",
            Title: "Payment",
            Description: "Payment from company",
            Date: "2021-09-10",
            Amount: 250,
        },
        {
            id: 6,
            type: "Salary",
            Category: "Income",
            Title: "Payment",
            Description: "Payment from company",
            Date: "2021-09-10",
            Amount: 250,
        },
        {   
            id: 7,
            type: "Salary",
            Category: "Income",
            Title: "Payment",
            Description: "Payment from company",
            Date: "2021-09-10",
            Amount: 250,
        },
        ]
        setData(formatValues(initialData))
    }, [])

    function formatValues(data) {
    let total = 0; // Variable para almacenar el total
    const formatData = data.map((invoice) => {
      // Modificar el monto basado en selectTypes
      selectTypes.forEach((type) => {
        let amountForTotal = parseFloat(invoice.Amount.toString().replace(/[$-]/g, ''));
        
        // Sumar al total
        if (type.IS_NEGATIVE && invoice.type === type.name) {
          total -= amountForTotal; // Restar si es negativo
        } else if (invoice.type === type.name) {
          total += amountForTotal; // Sumar si es positivo
        }
        
        let amount = invoice.Amount.toString().replace(/[$-]/g, '');
        if (invoice.type === type.name) {
          if (type.IS_NEGATIVE) {
            invoice.Amount = `-$${amount}`;
          } else {
            invoice.Amount = `$${amount}`;
          }
        }
      });
      return invoice;
    });

    setTotalAmount(total);
    return formatData;
  }

    function handleEdit(newData) {
        const dataCopy = [...data]
        const index = dataCopy.findIndex((invoice) => invoice.id === selectToEdit)
        dataCopy[index] = newData
        setData(formatValues(dataCopy))
        setSelectToEdit('')
    }

    function handleDelete(id) {
        const dataCopy = [...data]
        const index = dataCopy.findIndex((invoice) => invoice.id === id)
        dataCopy.splice(index, 1)
        setData(formatValues(dataCopy))
        setSelectToDelete('')
    }

    function handleAdd(newData) {
    setData(formatValues([...data, newData]));
    setAdding(false);
  }

    return (
        <div className="mx-12 ml-14 mt-4 p-2 max-h-fit w-full bg-white border-accentPalette border-2  rounded-xl">
            <div className="flex flex-row items-center p-2 gap-4">
                <FontAwesomeIcon className="text-1xl text-textPalette" icon={faClockRotateLeft} />
                <h1 className="text-textPalette text-1xl font-bold">History</h1>
            </div>
            <hr className="w-full border-1 border-accentPalette" />
            <div className="flex flex-col gap-4 py-3">
                <div className="flex flex-row min-h-10 justify-between">
                    <h1 className="text-textPalette text-1xl font-bold">This Month</h1>
                    <div className="flex flex-row items-center pr-10">
                        <FontAwesomeIcon
                            className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${adding ? "text-4xl text-hoverPalette pr-4" : "pr-6"}`}                            
                            icon={faSquarePlus}
                            onClick={() => {
                                setAdding(!adding)
                                setDeleting(false)
                                setEditing(false)
                                setSelectToEdit('')
                            }}
                        />
                        <FontAwesomeIcon
                            className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${editing ? "text-4xl text-hoverPalette pr-4" : "pr-4"}`}
                            icon={faPenToSquare}
                            onClick={() => {
                                setEditing(!editing)
                                setDeleting(false)
                                setAdding(false)
                                setSelectToEdit('')
                            }}
                        />
                        <FontAwesomeIcon 
                            className={`text-2xl text-textPalette hover:text-hoverPalette cursor-pointer ${deleting ? "text-4xl text-hoverPalette pl-0" : "pl-2"}`}
                            icon={faTrash}
                            onClick={() => {
                                setDeleting(!deleting)
                                setEditing(false)
                                setAdding(false)
                                setSelectToEdit('')
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-center flex-grow gap-4">
                    <AddDrawer open={adding} onAdd={handleAdd} onClose={() => setAdding(false)} selectTypes={selectTypes} selectCategories={selectCategories} />
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((invoice) => (
                                <TableRow 
                                    key={invoice.id}
                                    className={`${editing ? "hover:bg-accent2Palette" : ""} ${deleting ? "hover:bg-red-300" : ""}`}
                                    onClick={() => {
                                        if (editing) {
                                            setSelectToEdit(invoice.id)
                                        } else if (deleting) {
                                            setSelectToDelete(invoice.id)
                                            document.querySelector('#TriggerDelete').click()
                                        }
                                    }}
                                >
                                    {selectToEdit === invoice.id ? (
                                        <>
                                            <TableCell className="font-medium">
                                                <select id='Type' defaultValue={invoice.type}> 
                                                    {selectTypes.map((type) => (
                                                        <option key={type.id} value={type.name}>{type.name}</option>
                                                    ))}
                                                </select>
                                            </TableCell>
                                            <TableCell>
                                                <select id='Category' defaultValue={invoice.Category}> 
                                                    {selectCategories.map((category) => (
                                                        <option key={category.id} value={category.name}>{category.name}</option>
                                                    ))}
                                                </select>
                                            </TableCell>
                                            <TableCell><input id='Title' placeholder={invoice.Title} defaultValue={invoice.Title} /></TableCell>
                                            <TableCell><input id='Description' placeholder={invoice.Description} defaultValue={invoice.Description} /></TableCell>
                                            <TableCell>{invoice.Date}</TableCell>
                                            <TableCell className="text-right"><input id='Amount' placeholder={invoice.Amount} defaultValue={invoice.Amount} /></TableCell>
                                            <TableCell className="flex flex-row gap-2 justify-center items-center">
                                                <FontAwesomeIcon 
                                                    className='text-green-500 hover:text-green-400 text-2xl' 
                                                    icon={faCircleCheck} 
                                                    onClick={(e) => {
                                                        const newEditData = {
                                                            id: invoice.id,
                                                            type: document.getElementById('Type').value,
                                                            Category: document.getElementById('Category').value,
                                                            Title: document.getElementById('Title').value,
                                                            Description: document.getElementById('Description').value,
                                                            Date: invoice.Date,
                                                            Amount: document.getElementById('Amount').value,
                                                        };
                                                        handleEdit(newEditData);
                                                        e.stopPropagation(); 
                                                    }}
                                                />
                                                <FontAwesomeIcon 
                                                    className='text-red-500 hover:text-red-400 text-2xl' 
                                                    icon={faBan}
                                                    onClick={(e) => {
                                                        setSelectToEdit('')
                                                        e.stopPropagation(); 
                                                    }}
                                                />
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="font-medium">{invoice.type}</TableCell>
                                            <TableCell>{invoice.Category}</TableCell>
                                            <TableCell>{invoice.Title}</TableCell>
                                            <TableCell>{invoice.Description}</TableCell>
                                            <TableCell>{invoice.Date}</TableCell>
                                            <TableCell className="text-right">{invoice.Amount}</TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={editing ? 6 : 5}>Total</TableCell>
                                <TableCell className="text-right">${totalAmount}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                    {/* Diálogo de confirmación de eliminación */}
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
                                    <AlertDialogCancel onClick={() => setDeleting(false)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        handleDelete(selectToDelete)
                                    }}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </div>
    );
}