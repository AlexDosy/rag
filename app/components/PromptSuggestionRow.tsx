import PrompSuggestionButton from "./PromptSuggestionButton"

const PrompSuggestionRow=({onPromptClick}) =>{
    const prompts=[
        "who is head of racing for Aston Martin's F1 Academy team? ",
        "who is highest paid F1 driver? "
    ]
    return (
      <div className="prompt-suggestion-row">
        {prompts.map((prompt, index) => (
          <PrompSuggestionButton key={`suggestion-${index}`}
          text={prompt} 
          onClick={()=>onPromptClick(prompt)}/>
        ))}
      </div>
    );
}

export default PrompSuggestionRow