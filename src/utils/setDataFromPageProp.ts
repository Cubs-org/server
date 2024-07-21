import { Data } from "../types/pagesTypes";

function prepareDataOfPgProps(type: string, data: Data) {
  
  let newData;

  if (data?.width)
    newData = { value: data.value, loadOrder: data.loadOrder, width: data.width };
  else
    newData = { value: data.value, loadOrder: data.loadOrder };

  switch (type) {
    case "text":
      return { value: "", loadOrder: newData.loadOrder };
    case "number":
      return { value: 0, loadOrder: newData.loadOrder };
    case "datetime":
      const today = new Date().toISOString().split("T")[0] + " 00:00:00.000";
      return { 
        start: today,
        end: today, 
        loadOrder: newData.loadOrder 
      };
    case "formula":
      return { value: newData.value, loadOrder: newData.loadOrder };
    case "selection":
      return { value: "", loadOrder: newData.loadOrder, items: data.items };
    case "multi_selection":
      return { tags: {}, loadOrder: newData.loadOrder, items: data.items};
    // case "relation":
    //   return { value: newData.value, loadOrder: newData.loadOrder };
    // case "rollup":
    //   return { value: newData.value, loadOrder: newData.loadOrder };
    case "assign":
      return { value: newData.value, loadOrder: newData.loadOrder };
    case "checkbox":
      return { value: false, loadOrder: newData.loadOrder };
    case "status":
      return { value: newData.value, loadOrder: newData.loadOrder };
    // case "button":
    //   return { value: newData.value, loadOrder: newData.loadOrder };
    default:
      return { value: newData.value, loadOrder: newData.loadOrder };
  }
}

export default prepareDataOfPgProps;