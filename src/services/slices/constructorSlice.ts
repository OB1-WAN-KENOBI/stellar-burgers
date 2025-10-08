import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = { ...ingredient, id: uuidv4() } as TConstructorIngredient;
      } else {
        state.ingredients.push({
          ...ingredient,
          id: uuidv4()
        } as TConstructorIngredient);
      }
    },
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { addIngredient, resetConstructor } = constructorSlice.actions;
export default constructorSlice.reducer;
