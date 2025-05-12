#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"

// GPIO pin for the toggle button
#define BUTTON_GPIO 18  // Change to your GPIO number

// State variables
int last_button_state = 0;

void toggle_button_task(void *arg)
{
    // Configure the GPIO for input
    gpio_reset_pin(BUTTON_GPIO); // Updated function for pin selection
    gpio_set_direction(BUTTON_GPIO, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_GPIO, GPIO_PULLUP_ONLY);  // Use pull-up resistor

    while (1) 
    {
        int button_state = gpio_get_level(BUTTON_GPIO);

        // Check if button state has changed
        if (button_state != last_button_state) 
        {
            last_button_state = button_state;
            if (button_state == 0) 
            {
                printf("Button Pressed\n");
            } 
            else 
            {
                printf("Button Released\n");
            }
        }

        // Delay to debounce the button
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}

void app_main()
{
    printf("Toggle Button Example\n");
    xTaskCreate(toggle_button_task, "toggle_button_task", 2048, NULL, 5, NULL);
}
