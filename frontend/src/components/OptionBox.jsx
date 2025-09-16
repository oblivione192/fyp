function OptionBox({ style, IconComponent, text, onClick }) {
   return (
       <div 
           className="optionBox" 
           style={style}
           onClick={onClick}
       >
           <IconComponent className="icon" />
           <p className="buttonText"
             style={{
                 wordWrap:"break-word"
             }}
           >{text}</p>
       </div>
   );
} 

export default OptionBox; 