// Expense categories
export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'transport', name: 'Transportation', icon: 'car', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', icon: 'cart', color: '#45B7D1' },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#96CEB4' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'flash', color: '#FFEAA7' },
  { id: 'health', name: 'Health & Fitness', icon: 'fitness', color: '#DDA0DD' },
  { id: 'travel', name: 'Travel', icon: 'airplane', color: '#98D8C8' },
  { id: 'education', name: 'Education', icon: 'school', color: '#F7DC6F' },
  { id: 'personal', name: 'Personal Care', icon: 'person', color: '#BB8FCE' },
  { id: 'groceries', name: 'Groceries', icon: 'basket', color: '#82E0AA' },
  { id: 'others', name: 'Others', icon: 'ellipsis-horizontal', color: '#AEB6BF' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export const getCategoryById = (id: string) => 
  CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const getCategoryColor = (id: string) => getCategoryById(id).color;
