const Client = require('./Client');

describe('Client', () => {

    test('constructor should set name correctly', () => {
        // Arrange
        const expectedName = "John Doe";

        // Act
        const client = new Client(expectedName);

        // Assert
        expect(client.name).toBe(expectedName);
    });

    test('getter should return correct name', () => {
        // Arrange
        const client = new Client("Jane Doe");

        // Act
        const result = client.name;

        // Assert
        expect(result).toBe("Jane Doe");
    });

    test('setter should update name when valid', () => {
        // Arrange
        const client = new Client("John Doe");
        const newName = "Jane Smith";

        // Act
        client.name = newName;

        // Assert
        expect(client.name).toBe(newName);
    });

    test('setter should not update name when invalid', () => {
        // Arrange
        const client = new Client("John Doe");
        const originalName = "John Doe";
        global.alert = jest.fn();

        // Act
        client.name = "Jo";

        // Assert
        expect(client.name).toBe(originalName);
        expect(global.alert).toHaveBeenCalledWith("name is too short");
    });
});