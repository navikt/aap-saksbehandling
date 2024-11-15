// import { useEffect, useState } from 'react';
// import { diagnoseSøker } from 'lib/diagnosekoder/DiagnoseSøker';
// import { Button, Label } from '@navikt/ds-react';
// import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
// import { ValuePair } from '@navikt/aap-felles-react';
//
// export const AsyncCombobox = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedValue, setSelectedValue] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const [options, setOptions] = useState<ValuePair[]>([]);
//
//   useEffect(() => {
//     setOptions(diagnoseSøker('ICD10', searchQuery));
//   }, [searchQuery]);
//
//   console.log(options);
//   return (
//     <div className={'flex-column'}>
//       <Label>Velg diagnose</Label>
//       <div className={'navds-combobox__wrapper'}>
//         <div className={'navds-combobox__wrapper-inner navds-text-field__input'}>
//           <ul
//             className={
//               'navds-chips navds-combobox__selected-options navds-chips--small navds-detail navds-detail--small'
//             }
//           >
//             <li>
//               <div className={'navds-combobox__selected-options--no-bg'}>{selectedValue}</div>
//             </li>
//             <li>
//               <input
//                 className={
//                   'navds-combobox__input navds-body-short navds-body-short--small navds-combobox__input--hide-caret'
//                 }
//                 role={'combobox'}
//                 aria-controls={'hello'}
//                 aria-expanded={true}
//                 autoComplete={'off'}
//                 type={'text'}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </li>
//           </ul>
//           <div>
//             <Button
//               type={'button'}
//               className={'navds-combobox__button-toggle-list'}
//               icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
//               onClick={() => setIsOpen(!isOpen)}
//             />
//           </div>
//         </div>
//
//         <div className={`${isOpen ? 'navds-combobox__list' : 'navds-combobox__list navds-combobox__list--closed'}`}>
//           <ul className={'navds-combobox__list-options'}>
//             {options.map((option) => (
//               <li
//                 role={'option'}
//                 aria-selected={selectedValue === option.label}
//                 className={'navds-combobox__list-item'}
//                 onKeyPress={() => setSelectedValue(option.label)}
//                 key={option.value}
//                 id={option.value}
//                 value={option.value}
//                 tabIndex={-1}
//                 onClick={() => {
//                   setSelectedValue(option.label);
//                   setIsOpen(false);
//                 }
//               >
//                 {option.label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };
