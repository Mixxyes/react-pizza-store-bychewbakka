import qs, { ParsedQs } from 'qs';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';

import { SortType, setFilters } from '../redux/slices/filterSlice';

import { Categories } from '../components/Categories';
import { Sort, sortList } from '../components/Sort';
import { PizzaBlock } from '../components/pizzaBlock';
import { Skeleton } from '../components/pizzaBlock/Skeleton';
import { Pagination } from '../components/pagination';
import { fetchPizzas } from '../redux/slices/pizzaSlice';
import { useAppDispatch } from '../redux/store';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const isMounted = useRef(false);

  // const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const { items, status } = useSelector((state: any) => state.pizza);
  const { categoryId, sort, searchValue, currentPage } = useSelector((state: any) => state.filter);

  const getPizzas = async () => {
    // setIsLoading(true);

    // let create snippets for url for each param
    const pageUrlSnippet = `page=${currentPage}&limit=4`;
    const categoryUrlSnippet = categoryId > 0 ? `category=${categoryId}` : '';
    const searchUrlSnippet = searchValue ? `search=${searchValue}` : '';

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';

    // let create result snippet for url
    const urlSnippet = `${pageUrlSnippet}&${categoryUrlSnippet}&sortBy=${sortBy}&order=${order}&${searchUrlSnippet}`;

    // example below for case of fetch method usage
    // fetch(`https://646a233d183682d6144ea085.mockapi.io/items?${urlSnippet}`)
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setItems(json);
    //     setIsLoading(false);
    //   });

    //@ts-ignore
    dispatch(fetchPizzas(urlSnippet));
  };

  // монтируем, если есть параметры - диспатчим, если нет параметров - сразу делаем фетч
  useEffect(() => {
    if (window.location.search) {
      const params: ParsedQs = qs.parse(window.location.search.substring(1));
      console.log(params);
      const findSort = sortList.find((sortItem) => sortItem.sortProperty === params.sortProperty);
      const sort: SortType = findSort ? findSort : sortList[0];

      dispatch(
        setFilters({
          categoryId: Number(params.categoryId),
          sort,
          searchValue,
          currentPage: Number(params.currentPage),
        })
      );
    } else {
      getPizzas();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isMounted.current) {
      getPizzas();
    }
  }, [categoryId, sort, searchValue, currentPage]);

  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort, currentPage]);

  const skeletons = [...new Array(6)].map((_, i) => <Skeleton key={i} childKey={i} />);
  const pizzas = items
    // example below for seaching in frontside
    // .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
    .map((pizza: any) => {
      return <PizzaBlock key={pizza.id} {...pizza} />;
    });

  return (
    <div className="container">
      <div className="content__top">
        <Categories />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>
            Произошла ошибка <span>😕</span>
          </h2>
          <p>К сожалению не удалось получить пиццы. Попробуйте повторить попытку позже</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}

      <Pagination />
    </div>
  );
};
