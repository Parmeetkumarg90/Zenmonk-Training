"use client";
import { useState, useEffect } from "react";
import { getAllProducts } from "@/services/recipe";
import Pagination from '@mui/material/Pagination';
import PaginationItem from "@mui/material/PaginationItem";
import RecipeList from "@/components/list/recipe";
import style from './style.module.css';
import { recipeInterface } from "@/interfaces/recipe";
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addRecipes } from "@/redux/slices/recipe";
import { recipesSchema } from "@/schema/recipe";
import { enqueueSnackbar } from "notistack";

const RecipeCards = () => {
  const storedProducts = useSelector((state: RootState) => state.recipes);
  const dispatch = useDispatch();
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productList, setProductList] = useState<recipeInterface[] | []>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProducts(0);
  }, []);

  useEffect(() => {
    const calculateSkip = (currentPage - 1) * 10;
    setLoading(true);
    if (calculateSkip < storedProducts.length) {
      const currentPageRecipes = [];
      for (let index = calculateSkip; index < calculateSkip + 10; index++) {
        currentPageRecipes.push(storedProducts[index]);
      }
      setProductList(currentPageRecipes);
      const timer = setInterval(() => {
        clearInterval(timer);
        setLoading(false);
      }, 500);
    }
    else {
      getProducts(calculateSkip);
    }
  }, [currentPage]);

  const getProducts = async (current_skip: number) => {
    try {
      const result = await getAllProducts(current_skip);
      // console.log(result);
      const isValidResult = recipesSchema.safeParse(result.recipes);
      if (isValidResult.success) {
        setTotalProducts(Math.floor(result.total / 10));
        setProductList(result.recipes);
        dispatch(addRecipes(result.recipes));
      }
      else {
        enqueueSnackbar("Trying to access invalid page");
        setCurrentPage(1);
      }
    }
    catch (err) {
      console.log(err);
    }
    finally {
      const timer = setInterval(() => {
        clearInterval(timer);
        setLoading(false);
      }, 500);
    }
  };

  const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  }

  return (
    <Stack>
      <RecipeList data={productList} loading={isLoading} isBookmarkRecipes={false} />
      <Pagination count={totalProducts} page={currentPage} onChange={handlePageChange}
        color="primary" variant="outlined" shape="rounded" className={`${style.pagination}`}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{ color: 'white', '&.Mui-selected': { color: 'white', }, }}
          />
        )}
      />
    </Stack>
  );
}

export default RecipeCards;