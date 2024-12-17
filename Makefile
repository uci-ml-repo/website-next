# Include additional variables from an env file.
include .env

WEBSITE_NAME=website
NGINX_NAME=nginx

datalab: $(DATALAB12_CONTAINERS) website nginx

$(WEBSITE_NAME): $(DATALAB12_CONTAINERS)/$(WEBSITE_NAME).sif
	- singularity instance stop $@
	singularity instance start --writable \
	-B $(STATIC_DIRECTORY) \
	-B $(DATASET_DIRECTORY) \
	-B $(LEGACY_DATASET_DIRECTORY) \
	-B $(CRON_LOG_FILE) \
	$^ $(WEBSITE_NAME)

$(NGINX_NAME): $(DATALAB12_CONTAINERS)/$(NGINX_NAME).sif
	- singularity instance stop $@
	singularity instance start --writable $^ $(NGINX_NAME)

# Given the name of a .sif sandbox directory, search for corresponding .def file and build it.
# e.g. `make website.sif` will look for the "website.def" file to build the "website.sif" container.
# Whenever any files changes, this is eligible for rebuilding.
$(DATALAB12_CONTAINERS)/%.sif: $(WILDCARD *)
	# - singularity instance stop $*
	singularity build --force --fakeroot --sandbox $@ ./deploy/singularity/$*.def

$(DATALAB12_CONTAINERS):
	@ echo Creating directory for containers...
	@ mkdir -p $@

# Stop all containers and remove the sandbox directories.
.PHONY: clean
clean:
	- singularity instance stop -a
	rm -rf $(DATALAB12_CONTAINERS)/*.sif

# Help message.
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  datalab	Build the website"
	@echo "  clean		Stop all containers and remove the sandbox directories"
	@echo "  help		Show this help message"
	@echo "Run make <target> to perform the corresponding action."
