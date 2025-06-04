import SearchIcon from '@mui/icons-material/Search';
import { Chip, InputAdornment, Stack, TextField } from '@mui/material';

interface SearchProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchedValues: string[];
  setSearchedValues: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Search({
  searchValue,
  setSearchValue,
  searchedValues,
  setSearchedValues,
}: SearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
      const newValue = searchValue.trim();
      if (
        !searchedValues.find(
          (value) => value.toLowerCase() === newValue.toLowerCase()
        )
      ) {
        setSearchedValues([...searchedValues, newValue]);
      }
      setSearchValue('');
      e.preventDefault();
    }
  };

  const handleDelete = (value: string) => {
    setSearchedValues((values) => values.filter((v) => v !== value));
  };

  return (
    <Stack spacing={1}>
      <TextField
        variant='outlined'
        size='small'
        placeholder='Search…'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Stack direction='row' sx={{ gap: 1, flexWrap: 'wrap' }}>
        {searchedValues.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDelete(tag)}
            color='primary'
            variant='outlined'
          />
        ))}
      </Stack>
    </Stack>
  );
}
