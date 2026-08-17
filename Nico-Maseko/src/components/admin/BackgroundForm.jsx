function BackgroundForm({
  backgroundColor,
  setBackgroundColor,
  backgroundMessage,
  handleBackground,
}) {
  return (
    <form onSubmit={handleBackground} className="form-grid small-grid">
      <label>
        Gallery background
        <input
          type="color"
          value={backgroundColor}
          onChange={(event) => setBackgroundColor(event.target.value)}
        />
      </label>
      <button type="submit">Set background</button>
      {backgroundMessage && <p className="info-text">{backgroundMessage}</p>}
    </form>
  )
}

export default BackgroundForm
