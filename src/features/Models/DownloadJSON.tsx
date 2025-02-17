export const DownloadJSON = (data: any) => () => {
    const jsonString = JSON.stringify(data, null, 2); // Formátovaný JSON
    const blob = new Blob([jsonString], { type: "application/json" }); // Vytvoření Blob objektu
    const url = URL.createObjectURL(blob); // Vytvoření URL ke stažení
    const a = document.createElement("a"); // Vytvoření <a> tagu
    a.href = url;
    a.download = "data.json"; // Název souboru
    document.body.appendChild(a);
    a.click(); // Simulace kliknutí pro stažení souboru
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Uvolnění URL
};
