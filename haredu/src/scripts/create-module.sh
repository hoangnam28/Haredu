
COMPONENT_NAME=$1

if [ -z "$COMPONENT_NAME" ]; then
    echo "Usage: $0 <component_name>"
    exit 1
fi

ng generate module components/screen/$COMPONENT_NAME --routing
ng generate component components/screen/$COMPONENT_NAME
