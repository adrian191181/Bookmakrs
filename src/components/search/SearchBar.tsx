import { Search, ArrowRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useSettings } from "@/hooks/use-settings";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string, scope: 'all' | 'current') => void;
  currentEngine?: string;
  onEngineChange?: (engine: string) => void;
  currentCollection?: 'all' | 'current';
  onCollectionChange?: (collection: 'all' | 'current') => void;
}

// 添加搜索引擎图标组件
const SearchEngineIcon = ({ engine }: { engine: string }) => {
  switch (engine) {
    case 'Google':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      );
    case 'Brave':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.44 0C9.81 0 7.3 1.1 5.42 3C3.55 4.9 2.44 7.42 2.44 10.04C2.44 15.31 7.56 18.88 12.44 24C17.32 18.88 22.44 15.31 22.44 10.04C22.44 7.42 21.33 4.9 19.45 3C17.57 1.1 15.06 0 12.44 0ZM12.44 13.33C11.25 13.33 10.29 12.36 10.29 11.17C10.29 9.98 11.25 9.01 12.44 9.01C13.63 9.01 14.6 9.98 14.6 11.17C14.6 12.36 13.63 13.33 12.44 13.33Z" fill="#FB542B"/>
        </svg>
      );
    case 'Google Scholar':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C9.31 2 7 4.31 7 7C7 9.69 9.31 12 12 12C14.69 12 17 9.69 17 7C17 4.31 14.69 2 12 2ZM12 14C7.03 14 2 15.79 2 18.5V21H22V18.5C22 15.79 16.97 14 12 14Z" fill="#4285F4"/>
        </svg>
      );
      case 'ChatGPT':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.6 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.3927-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.1408 1.6465 4.4708 4.4708 0 0 1 .5346 3.0137zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
          </svg>
        );
      case 'Perplexity':
        return (
          <svg className="w-4 h-4" viewBox="0 0 512 510" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M384.707 78.9356L289.136 159.752H384.707V78.9356ZM268.396 146.455L408.304 28.1462V159.752H453V358.558H399.312V483.319L268.399 363.191V479.554H244.802V363.246L110.904 482.798V358.558H58.9985V159.752H112.688V27.2383L244.802 145.005V29.7306H268.399L268.396 146.455ZM227.908 183.349C179.454 183.377 131.024 183.349 82.5954 183.349V334.961H110.894V297.367L227.908 183.349ZM285.358 183.349L399.312 297.464V334.961H429.403V183.349C381.418 183.349 333.377 183.377 285.358 183.349ZM225.927 159.752L136.285 79.8449V159.752H225.927ZM244.802 331.743V199.779L134.501 307.23V430.226L244.802 331.743ZM268.717 200.026V331.522L375.715 429.705C375.715 388.834 375.699 348 375.699 307.133L268.717 200.026Z" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
  }
};

export function SearchBar({ 
  placeholder = "Search bookmarks...", 
  onSearch, 
  currentEngine = "Web Search", 
  onEngineChange, 
  currentCollection = 'all', 
  onCollectionChange 
}: SearchBarProps) {
  const engines = [ "Web Search", "AI Search","Bookmarks"];
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchEngine, setCurrentSearchEngine] = useState("Google");
  const [currentAIEngine, setCurrentAIEngine] = useState("ChatGPT");

  const aiSearchEngines: { [key: string]: string } = {
    ChatGPT: "https://chatgpt.com/?q=",
    Perplexity: "https://www.perplexity.ai/?q=",
    ThinkAny: "https://thinkany.so/search?q="
  };

  useEffect(() => {
    if (currentEngine && currentEngine !== "Web Search") {
      setInputValue("");
    }
  }, [currentEngine]);

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      onSearch?.("", currentCollection);
      setInputValue("");
      return;
    }
    
    if (currentEngine === "Bookmarks") {
      setIsSearching(true);
      try {
        onSearch?.(inputValue.trim(), currentCollection);
      } finally {
        setIsSearching(false);
      }
    } else if (currentEngine === "Web Search") {
      const searchUrls: { [key: string]: string } = {
        Brave: `https://search.brave.com/search?q=${encodeURIComponent(inputValue)}`,
        Google: `https://www.google.com/search?q=${encodeURIComponent(inputValue)}`,
        GoogleScholar: `https://scholar.google.com/scholar?hl=es&as_sdt=0%2C5&q=${encodeURIComponent(inputValue)}`,
        
      };
      
      const url = searchUrls[currentSearchEngine];
      if (url) {
        window.open(url, '_blank');
      }
    } else if (currentEngine === "AI Search") {
      const url = aiSearchEngines[currentAIEngine as keyof typeof aiSearchEngines];
      if (url) {
        window.open(url + encodeURIComponent(inputValue), '_blank');
      }
    }
  };

  const handleEngineChange = (engine: string) => {
    if (engine === "Web Search") {
      onEngineChange?.(engine);
      if (!currentSearchEngine) {
        setCurrentSearchEngine("Brave");
      }
    } else {
      onEngineChange?.(engine);
    }
    setIsFocused(true);
    editorRef.current?.focus();
  };

  const handleSearchEngineChange = (engine: string) => {
    setCurrentSearchEngine(engine);
    onEngineChange?.("Web Search");
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.textContent || '';
    setInputValue(value);
  };

  useEffect(() => {
    if (editorRef.current) {
      // 确保 div 的内容与 inputValue 同步
      if (editorRef.current.textContent !== inputValue) {
        editorRef.current.textContent = inputValue;
      }
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const { settings, loading } = useSettings('feature');

  // 如果正在加载或搜索功能被禁用，直接返回 null
  if (loading || settings?.enableSearch === 'false' || !settings?.enableSearch) {
    return null;
  }

  return (
    <div className="relative w-full max-w-[600px]">
      <div className="flex gap-1 pl-4">
        {engines.map((engine) => (
          <button 
            key={engine}
            className={`px-3 py-1 text-sm rounded-t-lg transition-all ${
              currentEngine === engine 
                ? "bg-black text-white font-medium shadow-sm" 
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleEngineChange(engine)}
            aria-pressed={currentEngine === engine}
          >
            {engine}
          </button>
        ))}
      </div>
      
      <div className="relative w-full flex flex-col">
        <div className="relative flex-1">
          <Search 
            className={`
              absolute left-3 top-4 h-4 w-4 text-muted-foreground
              transition-all duration-300 ease-in-out
              ${inputValue || isFocused 
                ? 'opacity-0 -translate-x-4' 
                : 'opacity-100 translate-x-0'
              }
            `} 
          />
          
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              className={`
                outline-none border rounded-xl w-full text-sm
                ${!inputValue && !isFocused ? 'pl-10' : 'pl-4'} 
                pr-12 
                ${isFocused || inputValue ? 'pb-12' : 'pb-3'}
                pt-3
                focus:ring-1 focus:ring-black/5
                hide-scrollbar
                transition-all duration-200 ease-in-out
              `}
              style={{
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                overflowX: 'hidden',
                wordBreak: 'break-word',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                height: isFocused || inputValue ? '8rem' : '3rem',
                minHeight: isFocused || inputValue ? '8rem' : '3rem',
                maxHeight: isFocused || inputValue ? '12rem' : '3rem'
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              role="textbox"
              aria-multiline="true"
              aria-label={placeholder}
            />

            {(isFocused || inputValue) && (
              <div 
                className={`
                  absolute bottom-[12px] left-4 flex items-center gap-4 py-1 w-[calc(100%-3rem)]
                  transition-all duration-300 ease-in-out
                  ${isFocused || inputValue
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 pointer-events-none'
                  }
                `}
                style={{
                  background: 'linear-gradient(to bottom, transparent, white 15%, white)',
                  pointerEvents: 'auto',
                  zIndex: 10,
                  paddingBottom: '0.75rem',
                  marginBottom: '-0.75rem',
                  height: '3rem',
                  clipPath: 'inset(0 0 1px 0)',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {currentEngine === "Web Search" && (
                  <div className="flex items-center gap-2">
                    {[
                      { value: 'all', label: 'All Collections' },
                      { value: 'current', label: 'Current Collection' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={`
                          text-sm flex items-center gap-2 px-3 py-1.5 rounded-full transition-all
                          ${currentCollection === option.value
                            ? "bg-gray-100 border border-gray-200 text-black font-medium" 
                            : "text-gray-600 border border-gray-100 hover:border-gray-200"
                          }
                        `}
                        onClick={() => onCollectionChange?.(option.value as 'all' | 'current')}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentEngine === "Web Search" && (
                  <div className="flex items-center gap-2">
                    {['Google', 'Bing', 'Yandex', 'Baidu'].map((engine) => (
                      <button 
                        key={engine}
                        className={`
                          text-sm flex items-center gap-2 px-3 py-1.5 rounded-full transition-all
                          ${currentSearchEngine === engine 
                            ? "bg-gray-100 border border-gray-200 text-black font-medium" 
                            : "text-gray-600 border border-gray-100 hover:border-gray-200"
                          }
                        `}
                        onClick={() => handleSearchEngineChange(engine)}
                      >
                        <SearchEngineIcon engine={engine} />
                        {engine}
                      </button>
                    ))}
                  </div>
                )}

                {currentEngine === "AI Search" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {Object.keys(aiSearchEngines).map((engine) => (
                      <button 
                        key={engine}
                        className={`
                          text-sm flex items-center gap-2 px-3 py-1.5 rounded-full transition-all
                          ${currentAIEngine === engine 
                            ? "bg-gray-100 border border-gray-200 text-black font-medium" 
                            : "text-gray-600 border border-gray-100 hover:border-gray-200"
                          }
                        `}
                        onClick={() => setCurrentAIEngine(engine)}
                      >
                        <SearchEngineIcon engine={engine} />
                        {engine}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div 
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: isFocused || inputValue
                  ? `translateY(20px)`
                  : 'translateY(-50%)',
                zIndex: 20
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div 
                className="bg-black rounded-full p-1.5 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={handleSearch}
              >
                {isSearching ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
