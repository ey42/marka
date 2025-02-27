"use client"
import { trpc } from '@/app/_trpc/client';
import { useState, useEffect, useRef, useContext } from 'react';
import { Frown, Search as SearchIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import ThemeContext from '@/context/themeContext'
import { usePathname } from 'next/navigation';


export default function Search() {
    const {data: data, refetch} = trpc.database.getAllPosts.useQuery()
    const posts = data?.allPosts;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<typeof posts>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const resultsContainerRef = useRef<HTMLDivElement>(null)
    const {search, setSearch} = useContext(ThemeContext)
    const pathname = usePathname()

  useEffect(() => {
    
    if (searchTerm === '') {
        setSearchResults([]);
        return; // Avoid filtering if search term is empty
    }

    const results = posts && posts.filter((post) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.catagory.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower)
      );
    });
    setSearchResults(results);

  }, [posts ,searchTerm]);
  
  

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (
      searchInputRef.current && !(searchInputRef.current.contains(event.target as Node)) &&
      resultsContainerRef.current &&
      !(resultsContainerRef.current).contains(event.target as Node)
      ) {
      setSearchTerm('');
      setSearchResults([]);
      setSearch(false);
      localStorage.removeItem("search")
      }
    }
  

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    
  },[setSearch, searchInputRef, resultsContainerRef])

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
};

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className=" bg-transparent">
                    <div  className={cn("flex w-72 gap-1 max-sm:w-40 h-9 flex-row border-2  transition-colors duration-150 bg-dark dark:bg-light dark:border-light  border-dark rounded-lg items-center",{
                      "w-[500px] h-20 border-4" : pathname === '/'
                    })}> 
                    <SearchIcon height={pathname === "/" ? 40 : 20} className="dark:stroke-dark w-20 stroke-light"/>
                      <input type="text" onClick={() => {
                       setSearch(true);
                       localStorage.setItem("search", "true")
                      }} className={cn("outline-none w-full bg-transparent placeholder:font-semibold placeholder:text-slate-300 font-bold font-mono text-sm text-light dark:text-black focus:placeholder:text-transparent dark:focus:placeholder:text-transparent dark:placeholder:text-slate-400",{
                        "placeholder:text-2xl text-2xl": pathname === "/"
                      })} onChange={handleChange} placeholder="search...on marka" value={searchTerm} ref={searchInputRef}/>
                    </div>
      </div>
      <div ref={resultsContainerRef} className={cn(" py-4  mt-[19px] bg-light dark:bg-dark dark:text-light text-black  resultsContainer", {
        'hidden': searchTerm === "",
        "border-dark rounded-b-lg max-h-[500px] overflow-y-scroll max-w-7xl  border-4 dark:border-light": pathname !== "/"
      })}>
      <h2 className='font-mono text-3xl font-bold mb-4 px-4'>Search Results of <span className="text-blue-500">m</span>ar<span className="text-yellow-500">k</span>a:</h2>
      {searchResults?.length === 0 && searchTerm !== "" ? ( <div className='flex'> <p className='text-xl font-mono font-thin pl-4'>No results found.</p> <Frown /></div>
       
      ) : (
        <ul className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
          {searchResults && searchResults.map((post) => (
            <Link href={`/product/${post.id}`} className='border-4 w-full text-sm font-mono  rounded-md border-dark dark:border-light flex flex-col gap-1 hover:dark:bg-light transition-colors duration-200 hover:text-light  hover:bg-dark hover:dark:text-black justify-between font-bold' key={post.id}>
              <div className='flex justify-between gap-2 px-2'>
                <div className='flex flex-col gap-2'>   
                  <h3>{post.title}</h3>
                  <p>{post.catagory}</p>
                </div>
                <div>
                  <p className='text-red-500'>{post.isSold ? "solded" :""}</p>
                  <p>{!post.isSold && `${post.price} ETB`}</p>
                </div>
           
              </div>
              <div>
                <Image src={post.file !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string)[0]}`:''} alt={post.file !== undefined ? post.title : "img"} width={500} height={500} className={cn('w-full h-48 ',{
                  'contrast-50': post.isSold === true
                })} loading="lazy"/>
              </div>
              
            </Link>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}