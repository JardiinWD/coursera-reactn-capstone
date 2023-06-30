import { useEffect, useRef } from "react";

export function getSectionListData(data) {
  const restructured = data.reduce((sections, item) => {
    const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const existingCategory = sections.find(section => section.name === categoryName);

    const newItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
    };

    if (existingCategory) {
      existingCategory.data.push(newItem);
    } else {
      sections.push({
        name: categoryName,
        data: [newItem],
      });
    }

    return sections;
  }, []);

  return restructured;
}


export function useUpdateEffect(effect, dependencies = []) {
  const hasMountedRef = useRef(true);

  useEffect(() => {
    // Check if the component has already mounted
    if (hasMountedRef.current) {
      // If it's the first mount, set hasMountedRef.current to false
      hasMountedRef.current = false;
    } else {
      // If it's not the first mount, execute the specified effect
      return effect();
    }
  }, dependencies);
}


export function getInitials(firstName, lastName) {
  const initials = [];
  if (firstName) initials.push(firstName.charAt(0));
  if (lastName) initials.push(lastName.charAt(0));
  return initials.join('');
}