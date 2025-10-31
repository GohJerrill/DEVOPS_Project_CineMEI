class Movie_Structure {
    constructor(Title, Age_Rating, Movie_Rating, Genre, Duration, Year, Description, Image) {

        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
        this.Title = Title;
        this.Age_Rating = Age_Rating;
        this.Movie_Rating = Movie_Rating;
        this.Genre = Genre;
        this.Duration = Duration;
        this.Year = Year;
        this.Description = Description;
        this.Image = Image;
        const timestamp = new Date().getTime();
    }
}
module.exports = { Movie_Structure };