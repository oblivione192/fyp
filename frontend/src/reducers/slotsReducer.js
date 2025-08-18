import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    hasInit: false, 
    slots: [], 
    pageSize: 5, 
    totalPages: 0,  
    totalSlots: 0 
};

const slotsReducer = createSlice({
    name: 'Slot',
    initialState,
    reducers: {
        initSlots: (state, action) => { 
            state.slots = [...action.payload];
            state.totalSlots = action.payload.length; 
            state.totalPages = Math.ceil(action.payload.length / state.pageSize); 
            state.hasInit = true;
        }, 

        AddSlots: (state, action) => {
            state.slots.push(...action.payload);  
            state.totalSlots = state.slots.length; 
            state.totalPages = Math.ceil(state.totalSlots / state.pageSize); 
        },

        AddSlot: (state, action) => { 
            state.slots.push(action.payload); 
            state.totalSlots += 1; 
            state.totalPages = Math.ceil(state.totalSlots / state.pageSize); 
        },

        UpdateSlot: (state, action) => {
            const index = state.slots.findIndex(slot => slot.SlotId === action.payload.SlotId);
            if (index !== -1) {
                state.slots[index] = {
                    ...state.slots[index],
                    ...action.payload
                };
            }
        },

        DeleteSlot: (state, action) => {
            state.slots = state.slots.filter(slot => slot.SlotId !== action.payload.SlotId);
            state.totalSlots = state.slots.length;
            state.totalPages = Math.ceil(state.totalSlots / state.pageSize);
        }
    }
});

export default slotsReducer.reducer;

export const { 
    initSlots,
    AddSlot,
    AddSlots,
    UpdateSlot,
    DeleteSlot
} = slotsReducer.actions;
