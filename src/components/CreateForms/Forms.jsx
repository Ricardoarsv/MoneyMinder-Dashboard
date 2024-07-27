import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import apiURL from '../../utils/fetchRoutes';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Saturation, Hue, useColor } from "react-color-palette";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import "react-color-palette/css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../App'; 

const typeFormSchema = z.object({
  TypeName: z.string().min(2, {
    message: "Name of type must be at least 2 characters.",
  }),
  Is_negative: z.boolean(),
  color: z.string().min(6, {
    message: "color of type must be at least 6 characters.",
  }),
});

const categoryFormSchema = z.object({
  Title: z.string().min(2, {
    message: "Category title must be at least 2 characters.",
  }),
  CategoryType: z.string().nonempty({
    message: "Category type must be selected.",
  }),
  color: z.string().min(6, {
    message: "color of type must be at least 6 characters.",
  }),
});

export default function CreateForms({ localUser }) {
  const { toast } = useToast();
  const [currentForm, setCurrentForm] = useState(null);
  const [colorPick, setColorPick] = useColor("#000001");
  const [selectToEdit, setSelectToEdit] = useState([]);
  const [colorType, setColorType] = useColor("#fffe00");
  const [colorCategory, setColorCategory] = useColor("#00ff35");
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [shouldResetColor, setShouldResetColor] = useState(true);
  const { token, setToken } = useAuth();

  useEffect(() => {
    fetch(`${apiURL}/types/get_types/${localUser}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTypes(data);
      })
      .catch((error) => console.error("Error fetching types:", error));

    fetch(`${apiURL}/categories/get_categories/${localUser}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, [localUser]);

  const typeForm = useForm({
    resolver: zodResolver(typeFormSchema),
    defaultValues: {
      id: Date.now(),
      TypeName: "",
      Is_negative: false,
      color: colorType.hex,
    },
  });

  const categoryForm = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      Title: "",
      CategoryType: "",
      color: colorCategory.hex,
    },
  });

  function onSubmitType(values) {
    if (types.findIndex((type) => type.typeName === values.typeName) !== -1) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Already has a type with that name.",
        variant: "destructive",
      });
    } else {
      fetch("http://localhost:8000/types/create_type", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify({
          typeName: values.TypeName,
          active: true,
          color: colorType.hex,
          is_negative: Boolean(values.Is_negative),
          owner_id: parseInt(localUser),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setTypes([...types, data]);
          typeForm.reset();
          document.querySelector("#NegativeMark").checked = false;
          toast({
            title: "Type created",
            description: "Type has been created successfully.",
            variant: "success",
          });
        })
        .catch((error) => console.error("Error creating type:", error));
    }
  }

  function onSubmitCategory(values) {
    if (
      categories.findIndex((categories) => categories.Title === values.Title) !==
      -1
    ) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Already has a category with that name.",
        variant: "destructive",
      });
    } else {
      fetch("http://localhost:8000/categories/create_category", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify({
          title: values.Title,
          category_type: parseInt(values.CategoryType),
          color: colorCategory.hex,
          owner_id: parseInt(localUser),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setCategories([...categories, data]);
          categoryForm.reset();
          toast({
            title: "Category created",
            description: "Category has been created successfully.",
            variant: "success",
          });
        })
        .catch((error) => console.error("Error creating type:", error));
    }
  }

  function handleEditType(values){
    fetch(`${apiURL}/types/update_type/${values.id}`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify({
          typeName: values.typeName,
          active: values.active,
          color: values.color,
          is_negative: values.is_negative,
          owner_id: parseInt(localUser),
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const typesCopy = [...types];
        const index = typesCopy.findIndex((type) => type.id === values.id);
        typesCopy[index] = values;
        setTypes(typesCopy);
      })
      .catch((error) => console.error("Error fetching types:", error));
    
  }

  function handleEditCategory(values){
    fetch(`${apiURL}/categories/update_category/${values.id}`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: values.title,
          category_type: values.category_type,
          active: values.active,
          color: values.color,
          owner_id: parseInt(localUser),
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const categoriesCopy = [...categories];
        const index = categoriesCopy.findIndex((type) => type.id === values.id);
        categoriesCopy[index] = values;
        setCategories(categoriesCopy);
      })
      .catch((error) => console.error("Error fetching types:", error));
  }

  function renderForm() {
    if (currentForm === "createType") {
      return (
        <>
          <h1 className="text-textPalette text-2xl font-bold">Create Types for Categories</h1>
          <Form {...typeForm}>
            <form onSubmit={typeForm.handleSubmit(onSubmitType)} className="space-y-6">
              <FormField
                control={typeForm.control}
                name="TypeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter type name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-red-600">If the value is ever negative, mark this option. Like a spent</p>
              <FormField
                control={typeForm.control}
                name="Is_negative"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="mr-2 w-full">Is Negative?</FormLabel>
                    <FormControl>
                        <Input id="NegativeMark" type="checkbox" {...field} />

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-4">
                <p className="font-bold">Color for the Type</p>
                <Saturation height={200} color={colorType} onChange={setColorType} />
                <Hue color={colorType} onChange={setColorType} />
                <p className="font-bold">HEX Color: {colorType.hex}</p>
              </div>

              <Button type="submit">Create Type</Button>
            </form>
          </Form>
        </>
      );
    }

    if (currentForm === "editType") {
      return (
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="text-[2vw] sm:text-[1vw]">
              <TableRow>
              <TableHead className="w-[100px]">typeName</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Is_negative</TableHead>
              <TableHead className="text-right">Active</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody className="text-[2vw] sm:text-[1vw]">
              {types.map((type) => (
                  <TableRow
                      key={type.id}
                      className="hover:bg-accent2Palette cursor-pointer"
                      onClick={() => {
                        setSelectToEdit(type)
                        document.querySelector('#TriggerEdit').click()
                      }}
                  >
                      <TableCell className="font-medium">{type.typeName}</TableCell>
                      <TableCell>
                        <div className="flex flex-row gap-2">
                          <div className="w-5 h-5 rounded-[0.24rem]" 
                          style={{ backgroundColor: type.color }}></div>
                          {type.color}
                        </div>
                      </TableCell>
                      <TableCell>{String(type.is_negative)}</TableCell>
                      <TableCell className="text-right">{String(type.active)}</TableCell>

                  </TableRow>
              ))}
          </TableBody>
          <TableFooter>
              <TableRow>
              <TableCell colSpan='3'>Total</TableCell>
              <TableCell className="text-right">{types.length}</TableCell>
              </TableRow>
          </TableFooter>
        </Table>
      )
    }

    if (currentForm === "createCategory") {
      return (
        <>
          <h1 className="text-textPalette text-2xl font-bold">Create Categories from Types</h1>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-6">
              <FormField
                control={categoryForm.control}
                name="Title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {types.length > 0 && (
                <FormField
                  control={categoryForm.control}
                  name="CategoryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Type</FormLabel>
                      <FormControl>
                        <select {...field} className="border border-gray-300 rounded-md p-2">
                          <option value="">Select a type</option>
                          {types.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.typeName}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex flex-col space-y-4">
                <p className="font-bold">Color for the Category</p>
                <Saturation height={200} color={colorCategory} onChange={setColorCategory} />
                <Hue color={colorCategory} onChange={setColorCategory} />
                <p className="font-bold">HEX Color: {colorCategory.hex}</p>
              </div>
              <Button type="submit">Create Category</Button>
            </form>
          </Form>
        </>
      );
    }

    if (currentForm === "editCategory") {
      return (
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="text-[2vw] sm:text-[1vw]">
              <TableRow>
              <TableHead className="w-[100px]">typeName</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Active</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody className="text-[2vw] sm:text-[1vw]">
              {categories.map((category) => (
                  <TableRow
                      key={category.id}
                      className="hover:bg-accent2Palette cursor-pointer"
                      onClick={() => {
                        setSelectToEdit(category)
                        document.querySelector('#TriggerEdit').click()
                      }}
                  >
                      <TableCell className="font-medium">{category.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-row gap-2">
                          <div className="w-5 h-5 rounded-[0.24rem]" 
                          style={{ backgroundColor: category.color }}></div>
                          {category.color}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{String(category.active)}</TableCell>

                  </TableRow>
              ))}
          </TableBody>
          <TableFooter>
              <TableRow>
              <TableCell colSpan='2'>Total</TableCell>
              <TableCell className="text-right">{categories.length}</TableCell>
              </TableRow>
          </TableFooter>
        </Table>
      )
    }

    return null;
  }

  // Función para convertir hexadecimal a RGB
  function hexToRgb(hex) {
    // Elimina el símbolo '#' si está presente
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return { r, g, b, a: 1 };
  }

  // Función para convertir RGB a HSV
  function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100, a: 1 };
}

  return (
    <div className="flex flex-col gap-6 w-full mx-4 mb-6 mt-4 p-4 max-h-fit bg-white border-accentPalette border-2 rounded-xl">
      <div className="flex flex-row gap-4 w-full justify-between">
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <h1 className="text-textPalette text-2xl font-bold">Manage Types and Categories</h1>
          {currentForm && (
            <h1 className="text-bgPalette text-1xl font-bold rounded-xl p-1 bg-accent2Palette">{currentForm}</h1>
          )}
        </div>
        <div className="space-x-0 md:space-x-4 flex flex-col md:flex-row items-center justify-center">
          <Button className='w-full' onClick={() => setCurrentForm("createType")}>Create Type</Button>
          <Button className='w-full' onClick={() => setCurrentForm("editType")}>Edit Type</Button>
          <Button className='w-full' onClick={() => setCurrentForm("createCategory")}>Create Category</Button>
          <Button className='w-full' onClick={() => setCurrentForm("editCategory")}>Edit Category</Button>
        </div>
      </div>

      <div className="space-y-6">
        {renderForm()}
      </div>
      
      {selectToEdit.length !== 0 && (
        <Dialog onOpenChange={(isOpen) => {
          if (!isOpen && shouldResetColor) {
            setColorPick({ hex: '#000001', rgb: { r: 0, g: 0, b: 0, a: 1 }, hsv: { h: 0, s: 0, v: 0, a: 1 } });
          }
          setShouldResetColor(true);
        }}>
          <DialogTrigger asChild>
            <button id='TriggerPickColor' className="hidden">Trigger</button>
          </DialogTrigger>
          <DialogContent className="w-[80%]" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Pick a new color</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4"> 
              <div className="flex flex-col space-y-4">
                <p className="font-bold">Color for the Type</p>
                <Saturation height={200} color={colorPick} onChange={setColorPick} />
                <Hue color={colorPick} onChange={setColorPick} />
                <p className="font-bold">HEX Color: {colorPick.hex}</p>
              </div>
              <Button onClick={() => {
                setShouldResetColor(false);
                document.querySelector('#TriggerPickColor').click()
                }} type="submit">Select color</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {currentForm === "editType" && (
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
                      <Label htmlFor={`TypeName-${selectToEdit.id}`} className="text-left">
                          TypeName
                      </Label>
                      <input 
                          id={`TypeName-${selectToEdit.id}`}
                          className="w-full"
                          placeholder={selectToEdit.typeName} 
                          defaultValue={selectToEdit.typeName}
                      />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor={`Color-${selectToEdit.id}`} className="text-left">
                          Color
                      </Label>
                      <div 
                        className="flex flex-row gap-2 items-center cursor-pointer"
                        onClick={() => {
                              const hexColor = selectToEdit.color;
                              const rgbColor = hexToRgb(hexColor);
                              const hsvColor = rgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);

                              setColorPick({
                                hex: hexColor,
                                rgb: rgbColor,
                                hsv: hsvColor
                              });
                              document.querySelector('#TriggerPickColor').click()
                            }}
                        >
                          <div
                            className="w-5 h-5 rounded-[0.24rem]"
                            style={{ backgroundColor: colorPick.hex !== '#000001' ? colorPick.hex : selectToEdit.color }}
                          />
                          <h1 className="font-bold">{colorPick.hex !== '#000001' ? colorPick.hex : selectToEdit.color}</h1>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor={`Is_negative-${selectToEdit.id}`} className="text-left">
                          Is_negative
                      </Label>
                      <input
                        id={`Is_negative-${selectToEdit.id}`} 
                        type="checkbox" defaultChecked={selectToEdit.is_negative} />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor={`Active-${selectToEdit.id}`} className="text-left">
                          Active
                      </Label>
                      <input 
                        id={`Active-${selectToEdit.id}`}
                        type="checkbox" defaultChecked={selectToEdit.active} />
                  </div>
              </div>
              <DialogFooter className='flex flex-row justify-center gap-4'>
                  <div 
                      className='flex flex-row gap-2 items-center cursor-pointer text-green-500 hover:text-green-400'
                      onClick={() => {
                        const newEditData = {
                          "id": selectToEdit.id,
                          "typeName": document.querySelector(`#TypeName-${selectToEdit.id}`).value,
                          "color" : colorPick.hex !== '#000001' ? colorPick.hex : selectToEdit.color,
                          "is_negative": document.querySelector(`#Is_negative-${selectToEdit.id}`).checked,
                          "active": document.querySelector(`#Active-${selectToEdit.id}`).checked
                        }
                        handleEditType(newEditData)
                        setSelectToEdit([])
                        setColorPick({ hex: '#000001', rgb: { r: 0, g: 0, b: 0, a: 1 }, hsv: { h: 0, s: 0, v: 0, a: 1 } })
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
                              setSelectToEdit([])
                              setColorPick({ hex: '#000001', rgb: { r: 0, g: 0, b: 0, a: 1 }, hsv: { h: 0, s: 0, v: 0, a: 1 } })
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

      {currentForm === "editCategory" && (
        <Dialog>
          <DialogTrigger asChild>
              <button id='TriggerEdit' className="hidden">Trigger</button>
          </DialogTrigger>
          <DialogContent className="w-[80%]" aria-describedby={undefined}>
              <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                      <Label htmlFor={`Color-${selectToEdit.id}`} className="text-left">
                          Color
                      </Label>
                      <div 
                        className="flex flex-row gap-2 items-center cursor-pointer"
                        onClick={() => {
                              const hexColor = selectToEdit.color;
                              const rgbColor = hexToRgb(hexColor);
                              const hsvColor = rgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);

                              setColorPick({
                                hex: hexColor,
                                rgb: rgbColor,
                                hsv: hsvColor
                              });
                              document.querySelector('#TriggerPickColor').click()
                            }}
                        >
                          <div
                            className="w-5 h-5 rounded-[0.24rem]"
                            style={{ backgroundColor: colorPick.hex !== '#000001' ? colorPick.hex : selectToEdit.color }}
                          />
                          <h1 className="font-bold">{colorPick.hex !== '#000001' ? colorPick.hex : selectToEdit.color}</h1>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor={`Active-${selectToEdit.id}`} className="text-left">
                          Active
                      </Label>
                      <input 
                        id={`Active-${selectToEdit.id}`}
                        type="checkbox" defaultChecked={selectToEdit.active} />
                  </div>
              </div>
              <DialogFooter className='flex flex-row justify-center gap-4'>
                  <div 
                      className='flex flex-row gap-2 items-center cursor-pointer text-green-500 hover:text-green-400'
                      onClick={() => {
                        const newEditData = {
                          "id": selectToEdit.id,
                          "title": document.querySelector(`#Title-${selectToEdit.id}`).value,
                          "category_type": selectToEdit.category_type,
                          "color" : colorPick.hex !== '#000001' ? colorPick.hex : selectToEdit.color,
                          "active": document.querySelector(`#Active-${selectToEdit.id}`).checked
                        }
                        handleEditCategory(newEditData)
                        setSelectToEdit([])
                        setColorPick({ hex: '#000001', rgb: { r: 0, g: 0, b: 0, a: 1 }, hsv: { h: 0, s: 0, v: 0, a: 1 } })
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
                              setSelectToEdit([])
                              setColorPick({ hex: '#000001', rgb: { r: 0, g: 0, b: 0, a: 1 }, hsv: { h: 0, s: 0, v: 0, a: 1 } })
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
      <Toaster />
    </div>
  );
}

CreateForms.propTypes = {
  localUser: PropTypes.string.isRequired,
};
